'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, ShoppingCart, Expand } from 'lucide-react';
import Layout from '../../../components/layout/Layout';
import { api } from '../../../lib/api';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import Lightbox from '../../../components/ui/lightbox';
import SaveToIdeabookModal from '../../../components/SaveToIdeabookModal';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: { amount: number; currency: string; originalPrice?: number };
  images: Array<{ url: string; caption?: string }>;
  category: string;
  brand: string;
  rating: { average: number; totalReviews: number };
  seller: {
    _id: string;
    name: string;
    location: string;
    rating: number;
  };
  specifications: Record<string, string>;
  inventory: { quantity: number };
  tags: string[];
  createdAt: string;
}

// Mock data for when API is unavailable
const mockProduct: ProductDetail = {
  _id: '1',
  name: 'Canapé 3 places en velours bleu',
  description: 'Canapé confortable en velours bleu marine avec pieds en bois massif. Structure en bois de hêtre et mousse haute résilience pour un confort optimal. Le velours de qualité supérieure est doux au toucher et résistant à l\'usure quotidienne.',
  price: { amount: 899, currency: 'EUR', originalPrice: 1299 },
  images: [
    { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop', caption: 'Vue d\'ensemble' },
    { url: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?w=800&h=600&fit=crop', caption: 'Vue de côté' },
    { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop', caption: 'Détails' },
  ],
  category: 'mobilier',
  brand: 'Maison du Canapé',
  rating: { average: 4.5, totalReviews: 124 },
  seller: { _id: 's1', name: 'Mobilier Design', location: 'Paris, France', rating: 4.7 },
  specifications: {
    material: 'Velours, Bois de hêtre',
    dimensions: '220 x 90 x 85 cm',
    weight: '45 kg',
    color: 'Bleu marine',
    seats: '3 places',
    warranty: '2 ans',
  },
  inventory: { quantity: 15 },
  tags: ['canapé', 'velours', 'salon', 'mobilier'],
  createdAt: '2025-01-10T10:00:00.000Z',
};

const specLabels: Record<string, string> = {
  material: 'Matériau',
  dimensions: 'Dimensions',
  weight: 'Poids',
  color: 'Couleur',
  seats: 'Places',
  warranty: 'Garantie',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart, isLoading: isCartLoading } = useCart();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<ProductDetail>(`/products/${params.id}`);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch {
        // Fallback to mock data if API is unavailable
        setProduct(mockProduct);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    const success = await addToCart(params.id as string);
    if (success) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleSaveToIdeabook = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    setIsSaveModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Chargement du produit...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit non trouvé</h2>
            <p className="text-gray-500 mb-4">Le produit que vous cherchez n&apos;existe pas.</p>
            <Link href="/products">
              <Button>Retour à la marketplace</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const discount = product.price.originalPrice
    ? Math.round((1 - product.price.amount / product.price.originalPrice) * 100)
    : null;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Lightbox */}
        <Lightbox
          images={product.images}
          initialIndex={selectedImage}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />

        {/* Save to Ideabook Modal */}
        <SaveToIdeabookModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          itemType="product"
          itemId={product._id}
        />

        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-emerald-600">Accueil</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-emerald-600">Marketplace</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="relative group">
                  <img
                    src={product.images[selectedImage]?.url || product.images[0]?.url}
                    alt={product.images[selectedImage]?.caption || product.name}
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => setIsLightboxOpen(true)}
                  />
                  {/* Image overlay actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      title="Plein écran"
                    >
                      <Expand className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleSaveToIdeabook}
                      className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      title="Sauvegarder"
                    >
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>
                  {product.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                      {selectedImage + 1} / {product.images.length}
                    </div>
                  )}
                  {discount && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white text-sm px-3 py-1">-{discount}%</Badge>
                    </div>
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === idx ? 'border-emerald-500' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.caption || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.brand}</Badge>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-emerald-600">
                      {product.price.amount.toLocaleString('fr-FR')} €
                    </span>
                    {product.price.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {product.price.originalPrice.toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating.average)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {product.rating.average.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({product.rating.totalReviews} avis)
                    </span>
                  </div>

                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Caractéristiques</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-500">{specLabels[key] || key}</p>
                        <p className="font-semibold text-gray-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Similar Products Placeholder */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits similaires</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Produit {i}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Add to Cart */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold text-emerald-600">
                      {product.price.amount.toLocaleString('fr-FR')} €
                    </span>
                    {product.price.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.price.originalPrice.toLocaleString('fr-FR')} €
                      </span>
                    )}
                  </div>
                  {product.inventory.quantity > 0 ? (
                    <p className="text-sm text-green-600 mb-4">
                      ✓ En stock ({product.inventory.quantity} disponibles)
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 mb-4">Rupture de stock</p>
                  )}
                  <Button 
                    className={`w-full mb-2 ${addedToCart ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    disabled={product.inventory.quantity === 0 || isCartLoading}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addedToCart ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSaveToIdeabook}
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Ajouter aux favoris
                  </Button>
                </CardContent>
              </Card>

              {/* Seller Card */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendu par</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold">
                        {product.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.seller.name}</p>
                      <p className="text-sm text-gray-500">📍 {product.seller.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.seller.rating)}
                    </div>
                    <span className="font-semibold text-gray-900">
                      {product.seller.rating.toFixed(1)}
                    </span>
                  </div>
                  <Button className="w-full">Contacter le vendeur</Button>
                </CardContent>
              </Card>

              {/* Product Meta */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Informations</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Référence</span>
                      <span className="text-gray-900">{product._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Publié le</span>
                      <span className="text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
