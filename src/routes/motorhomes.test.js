const request = require('supertest');
const app = require('../index');

describe('GET /api/motorhomes', () => {
  test('returns paginated records', async () => {
    const response = await request(app).get('/api/motorhomes?page=1&pageSize=2');

    expect(response.statusCode).toBe(200);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.pageSize).toBe(2);
    expect(response.body.data).toHaveLength(2);
  });

  test('filters by manufacturer', async () => {
    const response = await request(app).get('/api/motorhomes?manufacturer=Winnebago');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.every((item) => item.manufacturer === 'Winnebago')).toBe(true);
  });

  test('supports feature-based filtering', async () => {
    const response = await request(app).get('/api/motorhomes?features=wet%20bath,induction');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('supports free-text search for spaced layout phrases', async () => {
    const response = await request(app).get('/api/motorhomes?q=front%20dropdown%20bed');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.some((item) => item.featureTags.includes('front dropdown bed'))).toBe(true);
  });

  test('supports feature filtering for rear lounge layouts', async () => {
    const response = await request(app).get('/api/motorhomes?features=Rear%20Lounge');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.some((item) => item.id === 'auto-sleepers-fairford')).toBe(true);
  });

  test('supports model-year filtering', async () => {
    const response = await request(app).get('/api/motorhomes?modelYear=2020');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.every((item) => item.production.firstModelYear <= 2020 && item.production.lastModelYear >= 2020)).toBe(true);
  });

  test('supports ever offered option filtering', async () => {
    const response = await request(app).get('/api/motorhomes?everOption=wet-bath&optionOfferedAs=standard');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data.every((item) => item.optionAvailability.some((option) => option.optionKey === 'wet-bath' && option.everOffered))).toBe(true);
  });

  test('supports option availability by year and trim', async () => {
    const response = await request(app).get('/api/motorhomes?everOption=washer-dryer-prep&optionYear=2025&trim=36A');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe('entegra-vision-xl');
  });

  test('supports field projection', async () => {
    const response = await request(app).get('/api/motorhomes?fields=id,manufacturer,modelName&pageSize=1');

    expect(response.statusCode).toBe(200);
    expect(response.body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        manufacturer: expect.any(String),
        modelName: expect.any(String)
      })
    );

    expect(response.body.data[0].production).toBeUndefined();
  });

  test('rejects invalid page query value', async () => {
    const response = await request(app).get('/api/motorhomes?page=0');

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Invalid query parameters');
  });
});

describe('GET /api/motorhomes/:id', () => {
  test('returns a single motorhome by id', async () => {
    const response = await request(app).get('/api/motorhomes/winnebago-ekko');

    expect(response.statusCode).toBe(200);
    expect(response.body.data.id).toBe('winnebago-ekko');
  });

  test('returns 404 for unknown id', async () => {
    const response = await request(app).get('/api/motorhomes/not-a-real-id');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Motorhome not found');
  });
});
