const express = require('express');
const { z } = require('zod');
const motorhomes = require('../data/motorhomes.json');

const router = express.Router();

const normalizeSearchValue = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const querySchema = z.object({
  q: z.string().trim().optional(),
  manufacturer: z.string().trim().optional(),
  vehicleClass: z.string().trim().optional(),
  fuelType: z.string().trim().optional(),
  drivetrain: z.string().trim().optional(),
  modelYear: z.coerce.number().int().optional(),
  minYear: z.coerce.number().int().optional(),
  maxYear: z.coerce.number().int().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minLengthFt: z.coerce.number().optional(),
  maxLengthFt: z.coerce.number().optional(),
  minSleeps: z.coerce.number().int().optional(),
  maxSleeps: z.coerce.number().int().optional(),
  features: z.string().trim().optional(),
  everOption: z.string().trim().optional(),
  optionOfferedAs: z.enum(['standard', 'optional', 'package_only', 'dealer_installed']).optional(),
  optionYear: z.coerce.number().int().optional(),
  trim: z.string().trim().optional(),
  region: z.string().trim().optional(),
  sortBy: z.enum(['firstYear', 'lastYear', 'priceMin', 'priceMax', 'lengthMin', 'sleepsMax', 'manufacturer', 'modelName']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  fields: z.string().trim().optional()
});

const buildSearchText = (motorhome) => {
  const features = motorhome.featureTags?.join(' ') || '';
  const optionKeys = (motorhome.optionAvailability || []).map((option) => option.optionKey).join(' ');

  return normalizeSearchValue([
    motorhome.manufacturer,
    motorhome.modelName,
    motorhome.series,
    motorhome.vehicleClass,
    (motorhome.drivetrainOptions?.fuelTypes || []).join(' '),
    features,
    optionKeys
  ]
    .filter(Boolean)
    .join(' '));
};

const includesAllFeatures = (motorhome, featureTokens) => {
  if (featureTokens.length === 0) {
    return true;
  }

  const haystack = (motorhome.featureTags || []).map((feature) => normalizeSearchValue(feature));

  return featureTokens.every((token) => {
    const normalizedToken = normalizeSearchValue(token);
    return haystack.some((feature) => feature.includes(normalizedToken));
  });
};

const includesValue = (values, expected) => {
  if (!expected) {
    return true;
  }

  return (values || []).some((value) => String(value).toLowerCase() === expected.toLowerCase());
};

const yearInOption = (option, year) => {
  if (!year) {
    return true;
  }

  if (Array.isArray(option.standardYears) && option.standardYears.includes(year)) {
    return true;
  }

  if (Array.isArray(option.optionalYears) && option.optionalYears.includes(year)) {
    return true;
  }

  if (option.firstOfferedYear !== null && option.firstOfferedYear !== undefined && option.lastOfferedYear !== null && option.lastOfferedYear !== undefined) {
    return year >= option.firstOfferedYear && year <= option.lastOfferedYear;
  }

  return false;
};

const trimInOption = (option, trim) => {
  if (!trim) {
    return true;
  }

  if (!Array.isArray(option.offeredTrims) || option.offeredTrims.length === 0) {
    return true;
  }

  return option.offeredTrims.some((value) => value.toLowerCase() === trim.toLowerCase());
};

const regionInOption = (option, region) => {
  if (!region) {
    return true;
  }

  if (!Array.isArray(option.regions) || option.regions.length === 0) {
    return true;
  }

  return option.regions.some((value) => value.toLowerCase() === region.toLowerCase());
};

const hasOptionWithFilters = (motorhome, optionKey, offeredAs, optionYear, trim, region) => {
  const options = (motorhome.optionAvailability || []).filter(
    (option) => option.optionKey.toLowerCase() === optionKey.toLowerCase() && option.everOffered
  );

  if (options.length === 0) {
    return false;
  }

  return options.some((option) => {
    if (offeredAs && !includesValue(option.offeredAs, offeredAs)) {
      return false;
    }

    if (!yearInOption(option, optionYear)) {
      return false;
    }

    if (!trimInOption(option, trim)) {
      return false;
    }

    if (!regionInOption(option, region)) {
      return false;
    }

    return true;
  });
};

const getSortValue = (motorhome, sortBy) => {
  switch (sortBy) {
    case 'firstYear':
      return motorhome.production?.firstModelYear;
    case 'lastYear':
      return motorhome.production?.lastModelYear;
    case 'priceMin':
      return motorhome.specRange?.msrpUsd?.min;
    case 'priceMax':
      return motorhome.specRange?.msrpUsd?.max;
    case 'lengthMin':
      return motorhome.specRange?.lengthFt?.min;
    case 'sleepsMax':
      return motorhome.specRange?.sleeping?.max;
    case 'manufacturer':
      return motorhome.manufacturer;
    case 'modelName':
      return motorhome.modelName;
    default:
      return motorhome.production?.lastModelYear;
  }
};

const applyFieldSelection = (record, selectedFields) => {
  if (selectedFields.length === 0) {
    return record;
  }

  return selectedFields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(record, field)) {
      acc[field] = record[field];
    }

    return acc;
  }, {});
};

router.get('/', (req, res) => {
  const validation = querySchema.safeParse(req.query);

  if (!validation.success) {
    return res.status(400).json({
      error: 'Invalid query parameters',
      details: validation.error.issues
    });
  }

  const query = validation.data;
  const featureTokens = (query.features || '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const optionTokens = (query.everOption || '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  const filtered = motorhomes.filter((motorhome) => {
    const firstYear = motorhome.production?.firstModelYear;
    const lastYear = motorhome.production?.lastModelYear;

    if (query.q && !buildSearchText(motorhome).includes(normalizeSearchValue(query.q))) {
      return false;
    }

    if (query.manufacturer && motorhome.manufacturer.toLowerCase() !== query.manufacturer.toLowerCase()) {
      return false;
    }

    if (query.vehicleClass && motorhome.vehicleClass.toLowerCase() !== query.vehicleClass.toLowerCase()) {
      return false;
    }

    if (query.fuelType && !includesValue(motorhome.drivetrainOptions?.fuelTypes, query.fuelType)) {
      return false;
    }

    if (query.drivetrain && !includesValue(motorhome.drivetrainOptions?.driveTypes, query.drivetrain)) {
      return false;
    }

    if (query.modelYear !== undefined && !(firstYear <= query.modelYear && lastYear >= query.modelYear)) {
      return false;
    }

    if (query.minYear !== undefined && lastYear < query.minYear) {
      return false;
    }

    if (query.maxYear !== undefined && firstYear > query.maxYear) {
      return false;
    }

    if (query.minPrice !== undefined && (motorhome.specRange?.msrpUsd?.max ?? 0) < query.minPrice) {
      return false;
    }

    if (query.maxPrice !== undefined && (motorhome.specRange?.msrpUsd?.min ?? Number.MAX_SAFE_INTEGER) > query.maxPrice) {
      return false;
    }

    if (query.minLengthFt !== undefined && (motorhome.specRange?.lengthFt?.max ?? 0) < query.minLengthFt) {
      return false;
    }

    if (query.maxLengthFt !== undefined && (motorhome.specRange?.lengthFt?.min ?? Number.MAX_SAFE_INTEGER) > query.maxLengthFt) {
      return false;
    }

    if (query.minSleeps !== undefined && (motorhome.specRange?.sleeping?.max ?? 0) < query.minSleeps) {
      return false;
    }

    if (query.maxSleeps !== undefined && (motorhome.specRange?.sleeping?.min ?? Number.MAX_SAFE_INTEGER) > query.maxSleeps) {
      return false;
    }

    if (query.region && !includesValue(motorhome.regions, query.region)) {
      return false;
    }

    if (!includesAllFeatures(motorhome, featureTokens)) {
      return false;
    }

    if (optionTokens.length > 0) {
      const matchesAllOptions = optionTokens.every((optionKey) =>
        hasOptionWithFilters(motorhome, optionKey, query.optionOfferedAs, query.optionYear, query.trim, query.region)
      );

      if (!matchesAllOptions) {
        return false;
      }
    }

    return true;
  });

  const sortBy = query.sortBy || 'lastYear';
  const order = query.order || 'desc';

  filtered.sort((a, b) => {
    const aValue = getSortValue(a, sortBy);
    const bValue = getSortValue(b, sortBy);

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return order === 'asc' ? (aValue ?? 0) - (bValue ?? 0) : (bValue ?? 0) - (aValue ?? 0);
  });

  const selectedFields = (query.fields || '')
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);

  const page = query.page;
  const pageSize = query.pageSize;
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const pagedItems = filtered.slice(start, start + pageSize).map((item) => applyFieldSelection(item, selectedFields));

  return res.json({
    meta: {
      page,
      pageSize,
      totalItems,
      totalPages,
      sortBy,
      order
    },
    data: pagedItems
  });
});

router.get('/manufacturers', (req, res) => {
  const manufacturers = [...new Set(motorhomes.map((item) => item.manufacturer))].sort((a, b) => a.localeCompare(b));

  res.json({ data: manufacturers });
});

router.get('/:id', (req, res) => {
  const record = motorhomes.find((item) => item.id === req.params.id);

  if (!record) {
    return res.status(404).json({ error: 'Motorhome not found' });
  }

  return res.json({ data: record });
});

module.exports = router;
