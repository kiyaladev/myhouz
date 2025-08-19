import Joi from 'joi';

// Schémas de validation pour les utilisateurs
export const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  userType: Joi.string().valid('particulier', 'professionnel').required(),
  phone: Joi.string().pattern(/^[+]?[0-9\s-()]+$/).optional(),
  location: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    zipCode: Joi.string().required(),
    coordinates: Joi.object({
      lat: Joi.number().min(-90).max(90),
      lng: Joi.number().min(-180).max(180)
    }).optional()
  }).optional(),
  professionalInfo: Joi.when('userType', {
    is: 'professionnel',
    then: Joi.object({
      companyName: Joi.string().required(),
      businessNumber: Joi.string().optional(),
      services: Joi.array().items(Joi.string()).min(1).required(),
      description: Joi.string().max(1000).required(),
      workingZones: Joi.array().items(Joi.string()).optional(),
      pricing: Joi.object({
        startingPrice: Joi.number().min(0),
        currency: Joi.string().valid('EUR', 'USD', 'CAD').default('EUR')
      }).optional()
    }),
    otherwise: Joi.optional()
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Schémas de validation pour les projets
export const projectSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(20).max(2000).required(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      caption: Joi.string().max(200).optional(),
      tags: Joi.array().items(Joi.string()).optional()
    })
  ).min(1).required(),
  category: Joi.string().valid('renovation', 'decoration', 'construction', 'amenagement', 'jardin').required(),
  room: Joi.string().valid('salon', 'cuisine', 'chambre', 'salle-de-bain', 'bureau', 'entree', 'exterieur', 'autre').required(),
  style: Joi.array().items(
    Joi.string().valid('moderne', 'classique', 'minimaliste', 'industriel', 'scandinave', 'boheme', 'rustique', 'contemporain')
  ).min(1).required(),
  budget: Joi.object({
    min: Joi.number().min(0),
    max: Joi.number().min(Joi.ref('min')),
    currency: Joi.string().valid('EUR', 'USD', 'CAD').default('EUR')
  }).optional(),
  location: Joi.object({
    city: Joi.string().required(),
    country: Joi.string().default('France')
  }).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('draft', 'published', 'archived').default('draft')
});

// Schémas de validation pour les produits
export const productSchema = Joi.object({
  name: Joi.string().min(3).max(200).required(),
  description: Joi.string().min(20).max(2000).required(),
  images: Joi.array().items(Joi.string().uri()).min(1).required(),
  price: Joi.object({
    amount: Joi.number().min(0).required(),
    currency: Joi.string().valid('EUR', 'USD', 'CAD').default('EUR'),
    originalPrice: Joi.number().min(Joi.ref('amount')).optional()
  }).required(),
  category: Joi.string().valid('mobilier', 'decoration', 'eclairage', 'textile', 'rangement', 'exterieur', 'materiaux', 'outils').required(),
  subcategory: Joi.string().required(),
  brand: Joi.string().optional(),
  specifications: Joi.object({
    dimensions: Joi.object({
      width: Joi.number().min(0),
      height: Joi.number().min(0),
      depth: Joi.number().min(0),
      unit: Joi.string().valid('cm', 'm', 'mm').default('cm')
    }).optional(),
    material: Joi.array().items(Joi.string()).optional(),
    color: Joi.array().items(Joi.string()).optional(),
    style: Joi.array().items(Joi.string()).optional(),
    weight: Joi.number().min(0).optional()
  }).optional(),
  inventory: Joi.object({
    quantity: Joi.number().integer().min(0).required(),
    sku: Joi.string().required(),
    trackInventory: Joi.boolean().default(true)
  }).required(),
  shipping: Joi.object({
    weight: Joi.number().min(0).required(),
    dimensions: Joi.object({
      length: Joi.number().min(0),
      width: Joi.number().min(0),
      height: Joi.number().min(0)
    }).optional(),
    freeShipping: Joi.boolean().default(false),
    shippingCost: Joi.number().min(0).optional()
  }).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  status: Joi.string().valid('draft', 'active', 'inactive').default('draft')
});

// Schémas de validation pour les ideabooks
export const ideabookSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).optional(),
  coverImage: Joi.string().uri().optional(),
  isPublic: Joi.boolean().default(false),
  tags: Joi.array().items(Joi.string()).optional()
});

export const addItemToIdeabookSchema = Joi.object({
  type: Joi.string().valid('project', 'product', 'professional', 'article').required(),
  itemId: Joi.string().required(),
  note: Joi.string().max(300).optional()
});

// Schémas de validation pour les avis
export const reviewSchema = Joi.object({
  reviewedEntity: Joi.string().required(),
  entityType: Joi.string().valid('professional', 'product').required(),
  rating: Joi.object({
    overall: Joi.number().integer().min(1).max(5).required(),
    quality: Joi.number().integer().min(1).max(5).optional(),
    communication: Joi.number().integer().min(1).max(5).optional(),
    deadlines: Joi.number().integer().min(1).max(5).optional(),
    value: Joi.number().integer().min(1).max(5).optional()
  }).required(),
  title: Joi.string().min(5).max(200).required(),
  comment: Joi.string().min(20).max(1000).required(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  projectContext: Joi.object({
    projectType: Joi.string(),
    budget: Joi.number().min(0),
    duration: Joi.number().min(0)
  }).optional()
});

// Middleware de validation
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Données de validation invalides',
        errors
      });
    }

    req.body = value;
    next();
  };
};
