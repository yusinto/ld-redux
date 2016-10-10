var rewire = require('rewire');

const init = rewire('../src/init.js');

describe('index.js', () => {
  beforeEach(() => {
    const ldClientMock = {
      initialize: () => {
      },
      on: () => {
      }
    };

    // ldRedux.__set__('ldClient', ldClientMock);
  });

  // afterEach(() => {
  //   td.reset();
  // });
  //
  it('should call ldClient.initialize with the correct clientSideId and user', () => {
    console.log(`init: ${JSON.stringify(init)}`);
    init('some-client-side-id', {});
    //
    // td.verify(ldClient.initialize(10));
    //
    // expect(1).to.eq(2);
  });
});
