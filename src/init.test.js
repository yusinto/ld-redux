jest.mock('ldclient-js', () => ({
  initialize: global.td.function('ldClientPackage.initialize'),
}));

jest.mock('uuid', () => ({
  v4: () => 'some-unique-guid',
}));

jest.mock('ip', () => ({
  address: () => '111.222.333.456',
}));

jest.mock('ua-parser-js', () => () => ({
  getResult: () => ({ browser: { name: 'waterfox' } }),
  getDevice: () => ({ type: 'desktop' }),
}));

jest.useFakeTimers();

import ldClientPackage from 'ldclient-js';
import td from 'testdouble';
import ldReduxInit from './init';

const MOCK_CLIENT_SIDE_ID = 'some-client-side-id';
const mock = {};

describe('initialize', () => {
  beforeEach(() => {
    mock.store = td.object(['dispatch']);
    mock.on = td.function('ldClient.on');
    mock.variation = td.function('ldClient.variation');

    td.when(ldClientPackage.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.anything(), td.matchers.anything())).thenReturn(
      { on: mock.on, variation: mock.variation },
    );
    td.when(mock.on('ready', td.matchers.isA(Function))).thenDo((s, f) => {
      mock.onReadyHandler = f;
    });
  });

  afterEach(() => {
    td.reset();
  });

  it('should initFlags with default values and save to redux store', () => {
    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
    });

    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { isLDReady: false, testFlag: false, anotherTestFlag: true },
        }),
      ),
    );
  });

  it('should initUser with default user if none is specified', () => {
    const defaultUser = {
      key: 'some-unique-guid',
      ip: '111.222.333.456',
      custom: {
        browser: 'waterfox',
        device: 'desktop',
      },
    };

    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
    });

    td.verify(
      ldClientPackage.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.contains(defaultUser), td.matchers.anything()),
    );
  });

  it('should initUser with custom user if it is specified', () => {
    const user = { key: 'yus-the-man', firstName: 'yus', lastName: 'ng' };

    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
      user,
    });

    td.verify(ldClientPackage.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.contains(user), td.matchers.anything()));
  });

  it('should pass options through if specified', () => {
    const options = { bootstrap: 'localStorage' };
    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
      options,
    });

    // assert
    td.verify(ldClientPackage.initialize(MOCK_CLIENT_SIDE_ID, td.matchers.anything(), td.matchers.contains(options)));
  });

  it('should set flag values once ready', () => {
    td.when(mock.variation('test-flag', false)).thenReturn(true);
    td.when(mock.variation('another-test-flag', true)).thenReturn(false);

    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
    });

    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { isLDReady: false, testFlag: false, anotherTestFlag: true },
        }),
      ),
    );

    mock.onReadyHandler();

    jest.runAllTimers();

    td.verify(mock.store.dispatch(td.matchers.anything()), { times: 2 });
    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { isLDReady: true, testFlag: true, anotherTestFlag: false },
        }),
      ),
    );
  });

  it('should subscribe to flag changes once ready', () => {
    td.when(mock.on('change:test-flag', td.matchers.isA(Function))).thenDo((e, f) => f(true));
    td.when(mock.on('change:another-test-flag', td.matchers.isA(Function))).thenDo((e, f) => f(false));

    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
    });

    mock.onReadyHandler();

    jest.runAllTimers();

    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { testFlag: true },
        }),
      ),
    );
    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { anotherTestFlag: false },
        }),
      ),
    );
    td.verify(mock.store.dispatch(td.matchers.anything()), { times: 4 });
  });

  it('should not subscribe to flag changes if subscribe false', () => {
    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
      subscribe: false,
    });

    // initFlags
    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { isLDReady: false, testFlag: false, anotherTestFlag: true },
        }),
      ),
    );

    mock.onReadyHandler();
    jest.runAllTimers();

    td.verify(mock.on('change:test-flag', td.matchers.isA(Function)), { times: 0 });
    td.verify(mock.on('change:another-test-flag', td.matchers.isA(Function)), { times: 0 });
  });

  it('should subscribe to flag changes if subscribe is true', () => {
    ldReduxInit({
      clientSideId: MOCK_CLIENT_SIDE_ID,
      dispatch: mock.store.dispatch,
      flags: { 'test-flag': false, 'another-test-flag': true },
      subscribe: true,
    });

    // initFlags
    td.verify(
      mock.store.dispatch(
        td.matchers.contains({
          type: 'SET_FLAGS',
          data: { isLDReady: false, testFlag: false, anotherTestFlag: true },
        }),
      ),
    );

    mock.onReadyHandler();
    jest.runAllTimers();

    td.verify(mock.on('change:test-flag', td.matchers.isA(Function)));
    td.verify(mock.on('change:another-test-flag', td.matchers.isA(Function)));
  });
});
