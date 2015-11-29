import { setResolver } from 'ember-mocha';
import resolver from './helpers/resolver';
import Reporter from './helpers/reporter';

setResolver(resolver);
window.mocha.reporter(runner => new Reporter(runner));
window.mocha.setup({
  timeout: 10000,
  slow:     2000
});
