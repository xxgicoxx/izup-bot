const { UrlService } = require('../services');

const urlService = new UrlService();

class UrlController {
  async handle($) {
    urlService.handle($);
  }

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

  async help($) {
    urlService.help($);
  }
}

module.exports = UrlController;
