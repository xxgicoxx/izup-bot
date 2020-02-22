const { UrlService } = require('../services');

const urlService = new UrlService();

class UrlController {
  async add($) {
    urlService.add($);
  }

  async remove($) {
    urlService.remove($);
  }

  async check($) {
    urlService.check($);
  }

  async checkChanges($) {
    urlService.checkChanges($);
  }

  async list($) {
    urlService.list($);
  }
}

module.exports = UrlController;
