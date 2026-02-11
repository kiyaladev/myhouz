import { Request, Response } from 'express';
import Project from '../models/Project';
import Product from '../models/Product';
import User from '../models/User';
import Article from '../models/Article';

interface SearchResultSet {
  items: any[];
  total: number;
}

interface SearchResults {
  projects?: SearchResultSet;
  products?: SearchResultSet;
  professionals?: SearchResultSet;
  articles?: SearchResultSet;
  [key: string]: SearchResultSet | undefined;
}

export class SearchController {
  // Escape special regex characters to prevent ReDoS
  private static escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Global search across multiple entities
  static async globalSearch(req: Request, res: Response): Promise<void> {
    try {
      const { q, type, page = 1, limit = 10 } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        res.status(400).json({ success: false, message: 'La requête de recherche doit contenir au moins 2 caractères' });
        return;
      }

      const query = q.trim();
      const pageNum = parseInt(page as string) || 1;
      const limitNum = Math.min(parseInt(limit as string) || 10, 20);
      const skip = (pageNum - 1) * limitNum;

      const results: SearchResults = {};
      const searchRegex = new RegExp(SearchController.escapeRegex(query), 'i');

      const searchType = type as string;

      if (!searchType || searchType === 'projects') {
        const projectFilter = {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { style: searchRegex },
            { tags: searchRegex }
          ],
          status: 'published'
        };
        const [projects, projectCount] = await Promise.all([
          Project.find(projectFilter)
            .select('title description category style images budget location')
            .populate('professional', 'firstName lastName')
            .skip(searchType ? skip : 0)
            .limit(searchType ? limitNum : 5)
            .sort({ createdAt: -1 }),
          Project.countDocuments(projectFilter)
        ]);
        results.projects = { items: projects, total: projectCount };
      }

      if (!searchType || searchType === 'products') {
        const productFilter = {
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { category: searchRegex },
            { brand: searchRegex },
            { tags: searchRegex }
          ],
          status: 'active'
        };
        const [products, productCount] = await Promise.all([
          Product.find(productFilter)
            .select('name description category brand price images slug')
            .populate('seller', 'firstName lastName')
            .skip(searchType ? skip : 0)
            .limit(searchType ? limitNum : 5)
            .sort({ createdAt: -1 }),
          Product.countDocuments(productFilter)
        ]);
        results.products = { items: products, total: productCount };
      }

      if (!searchType || searchType === 'professionals') {
        const proFilter = {
          userType: 'professionnel',
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { 'professionalInfo.companyName': searchRegex },
            { 'professionalInfo.specialties': searchRegex },
            { 'professionalInfo.description': searchRegex }
          ]
        };
        const [professionals, proCount] = await Promise.all([
          User.find(proFilter)
            .select('firstName lastName avatar professionalInfo.companyName professionalInfo.specialties professionalInfo.rating professionalInfo.location')
            .skip(searchType ? skip : 0)
            .limit(searchType ? limitNum : 5)
            .sort({ 'professionalInfo.rating': -1 }),
          User.countDocuments(proFilter)
        ]);
        results.professionals = { items: professionals, total: proCount };
      }

      if (!searchType || searchType === 'articles') {
        const articleFilter = {
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { excerpt: searchRegex },
            { category: searchRegex },
            { tags: searchRegex }
          ],
          status: 'published'
        };
        const [articles, articleCount] = await Promise.all([
          Article.find(articleFilter)
            .select('title excerpt category featuredImage slug')
            .populate('author', 'firstName lastName')
            .skip(searchType ? skip : 0)
            .limit(searchType ? limitNum : 5)
            .sort({ createdAt: -1 }),
          Article.countDocuments(articleFilter)
        ]);
        results.articles = { items: articles, total: articleCount };
      }

      const totalResults = Object.values(results).reduce((sum: number, r: SearchResultSet | undefined) => sum + (r?.total || 0), 0);

      res.json({
        success: true,
        data: results,
        query,
        totalResults,
        ...(searchType && {
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: results[searchType]?.total || 0,
            pages: Math.ceil((results[searchType]?.total || 0) / limitNum)
          }
        })
      });
    } catch (error) {
      console.error('Erreur recherche globale:', error);
      res.status(500).json({ success: false, message: 'Erreur lors de la recherche' });
    }
  }

  // Autocomplete suggestions
  static async suggestions(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        res.json({ success: true, data: [] });
        return;
      }

      const searchRegex = new RegExp(SearchController.escapeRegex(q.trim()), 'i');

      const [projects, products, professionals] = await Promise.all([
        Project.find({ title: searchRegex, status: 'published' }).select('title').limit(3),
        Product.find({ name: searchRegex, status: 'active' }).select('name').limit(3),
        User.find({
          userType: 'professionnel',
          $or: [
            { 'professionalInfo.companyName': searchRegex },
            { firstName: searchRegex }
          ]
        }).select('firstName lastName professionalInfo.companyName').limit(3)
      ]);

      const suggestions = [
        ...projects.map(p => ({ type: 'project', text: p.title, id: p._id })),
        ...products.map(p => ({ type: 'product', text: p.name, id: p._id })),
        ...professionals.map(p => ({
          type: 'professional',
          text: (p as any).professionalInfo?.companyName || `${p.firstName} ${p.lastName}`,
          id: p._id
        }))
      ];

      res.json({ success: true, data: suggestions });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors des suggestions' });
    }
  }
}
