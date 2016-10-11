import chai from 'chai';
import td from 'testdouble';
import {setupDom} from './setupJsDom';

setupDom();

global.expect = chai.expect;
global.td = td;

chai.should();