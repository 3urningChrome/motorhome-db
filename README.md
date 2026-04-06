# Motorhome DB

Public, query-friendly motorhome dataset and API focused on model types, not VIN-level instances.

## What Is Included

- Model-level records with production history and trim coverage.
- Option availability history for answering "did this model ever come with X?".
- REST API filters for option, year, trim, and offer type.
- Test coverage for query behavior.

## Model-Level Data Structure

Each record describes a model family across production years.

- Identity: `id`, `manufacturer`, `modelName`, `series`, `vehicleClass`, `bodyType`
- Production history: `production.firstModelYear`, `production.lastModelYear`, `production.yearsOffered`
- Trims: `trims[]` with trim codes/names
- Range specs: `specRange.lengthFt`, `specRange.sleeping`, `specRange.msrpUsd`, `specRange.gvwrLb`
- Drivetrain options: arrays of fuel/drive/engine families
- `featureTags[]`: normalized searchable tags
- `optionAvailability[]`: time-bounded option history per model
- `derivedFlags`: fast booleans for common facets
- Sources and timestamps

### Option Availability Shape

Each option history object includes:

- `optionKey`: canonical option identifier (example: `solar-array`)
- `label`, `category`
- `everOffered`
- `offeredAs`: one or more of `standard`, `optional`, `package_only`, `dealer_installed`
- `standardYears[]`, `optionalYears[]`
- `firstOfferedYear`, `lastOfferedYear`
- `offeredTrims[]`
- `regions[]`
- `requiredPackageKeys[]`, `incompatibleOptionKeys[]`

## API

### Health

`GET /api/health`

### Model Catalog

`GET /api/motorhomes`

Supported query parameters:

- `q`: search manufacturer/model/series/class/feature tags/option keys
- `manufacturer`, `vehicleClass`
- `fuelType`, `drivetrain`
- `modelYear`: include models offered in that year
- `minYear`, `maxYear`: production overlap filters
- `minPrice`, `maxPrice`: compares against model `specRange.msrpUsd`
- `minLengthFt`, `maxLengthFt`
- `minSleeps`, `maxSleeps`
- `region`
- `features`: comma-separated feature tag tokens
- `everOption`: comma-separated option keys that must have been offered
- `optionOfferedAs`: `standard`, `optional`, `package_only`, `dealer_installed`
- `optionYear`: constrain option availability to specific year
- `trim`: constrain option availability to trim code
- `sortBy`: `firstYear`, `lastYear`, `priceMin`, `priceMax`, `lengthMin`, `sleepsMax`, `manufacturer`, `modelName`
- `order`: `asc` or `desc`
- `page`, `pageSize`
- `fields`: top-level field projection

Examples:

```bash
curl "http://localhost:3000/api/motorhomes?everOption=solar-array&optionOfferedAs=optional&optionYear=2024"
curl "http://localhost:3000/api/motorhomes?everOption=washer-dryer-prep&trim=36A&optionYear=2025"
curl "http://localhost:3000/api/motorhomes?modelYear=2020&vehicleClass=Travel%20Trailer"
```

### Manufacturers

`GET /api/motorhomes/manufacturers`

### Single Model

`GET /api/motorhomes/:id`

## Run Locally

```bash
npm install
npm run dev
npm test
```

## How To Grow The Dataset

- Keep `optionKey` canonical and stable across years.
- Prefer `optionAvailability` updates over free-form notes.
- Use ranges for evolving specs and year arrays for non-contiguous availability.
- Attach source URLs for every significant availability claim.

## License

MIT
