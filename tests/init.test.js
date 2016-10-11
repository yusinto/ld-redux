import proxyquire from 'proxyquire';
import td from 'testdouble';

const MOCK_CLIENT_SIDE_ID = 'some-client-side-id';
const mock = {};
let ldReduxInit;

describe('initialize', () => {
  beforeEach(() => {
    mock.store = td.object(['dispatch']);
    mock.on = td.function('ldClient.on');
    mock.initialize = td.function('ldClient.initialize');
    mock.onReadyHandler;

    td.when(mock.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.anything())).thenReturn({on: mock.on});
    td.when(mock.on('ready', td.matchers.isA(Function))).thenDo((s, f) => mock.onReadyHandler = f);

    mock.ldClient = {
      initialize: mock.initialize,
    };

    ldReduxInit = proxyquire('../src/init.js', {'ldclient-js': mock.ldClient}).default;
  });

  afterEach(() => {
    td.reset();
  });

  it('should call ldClient.initialize with the correct clientSideId and user', () => {
    // arrange
    // act
    ldReduxInit(MOCK_CLIENT_SIDE_ID, mock.store);

    // assert
    td.verify(mock.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.argThat(user => {
      return user.key && user.ip && user.custom &&
        user.custom.browser === 'WebKit' &&
        user.custom.device === 'desktop';
    })));
  });

  it('should subscribe to ready event with redux dispatch as callback', () => {
    // arrange
    // act
    ldReduxInit(MOCK_CLIENT_SIDE_ID, mock.store);

    // assert
    td.verify(mock.on('ready', td.matchers.isA(Function)));
    mock.onReadyHandler();
    td.verify(mock.store.dispatch(td.matchers.contains({type: "LD_READY"})));
  });

  it('should correctly initialize passed in user', () => {
    // arrange
    const customUser = {key: 'yus-the-man', firstName: 'yus', lastName: 'ng'};

    // act
    ldReduxInit(MOCK_CLIENT_SIDE_ID, mock.store, customUser);

    // assert
    td.verify(mock.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.contains(customUser)));
    td.verify(mock.on('ready', td.matchers.isA(Function)));
    mock.onReadyHandler();
    td.verify(mock.store.dispatch(td.matchers.contains({type: "LD_READY"})));
  });
});
