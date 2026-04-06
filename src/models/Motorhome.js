/**
 * Motorhome Model Schema
 * Model-level structure for type history, not individual VIN instances.
 */

class Motorhome {
  constructor(data) {
    this.id = data.id;
    this.manufacturer = data.manufacturer;
    this.modelName = data.modelName;
    this.series = data.series || null;
    this.vehicleClass = data.vehicleClass;
    this.bodyType = data.bodyType || null;
    this.regions = data.regions || [];
    this.production = data.production || {};
    this.trims = data.trims || [];
    this.specRange = data.specRange || {};
    this.drivetrainOptions = data.drivetrainOptions || {};
    this.featureTags = data.featureTags || [];
    this.optionAvailability = data.optionAvailability || [];
    this.derivedFlags = data.derivedFlags || {};
    this.sources = data.sources || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      manufacturer: this.manufacturer,
      modelName: this.modelName,
      series: this.series,
      vehicleClass: this.vehicleClass,
      bodyType: this.bodyType,
      regions: this.regions,
      production: this.production,
      trims: this.trims,
      specRange: this.specRange,
      drivetrainOptions: this.drivetrainOptions,
      featureTags: this.featureTags,
      optionAvailability: this.optionAvailability,
      derivedFlags: this.derivedFlags,
      sources: this.sources,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Motorhome;
