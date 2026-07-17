import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import API from '../services/api';

// Mock the API client
jest.mock('../services/api', () => ({
  post: jest.fn(),
}));

describe('AuthContext Register Tests (Phạm Văn Quyết - DE190425)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  test('TC_AUTH_REG_001 – API register success', async () => {
    const mockUserData = {
      id: 1,
      username: 'Phạm Văn Quyết',
      email: 'de190425@fpt.edu.vn',
    };

    API.post.mockResolvedValue({
      data: mockUserData,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.register({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef',
      });
    });

    expect(API.post).toHaveBeenCalledWith('/auth/register', {
      username: 'Phạm Văn Quyết',
      email: 'de190425@fpt.edu.vn',
      password: 'abcdef',
    });

    expect(res).toEqual({
      success: true,
      user: mockUserData,
      message: 'Đăng ký thành công',
    });
  });

  test('TC_AUTH_REG_002 – API error data là string', async () => {
    const apiError = {
      response: {
        data: 'Email đã tồn tại',
      },
    };

    API.post.mockRejectedValue(apiError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.register({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef',
      });
    });

    expect(res).toEqual({
      success: false,
      message: 'Email đã tồn tại',
    });
  });

  test('TC_AUTH_REG_003 – API error data có message', async () => {
    const apiError = {
      response: {
        data: {
          message: 'Tài khoản đã tồn tại',
        },
      },
    };

    API.post.mockRejectedValue(apiError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.register({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef',
      });
    });

    expect(res).toEqual({
      success: false,
      message: 'Tài khoản đã tồn tại',
    });
  });

  test('TC_AUTH_REG_004 – API error data có detail', async () => {
    const apiError = {
      response: {
        data: {
          detail: 'Invalid registration information',
        },
      },
    };

    API.post.mockRejectedValue(apiError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.register({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef',
      });
    });

    expect(res).toEqual({
      success: false,
      message: 'Invalid registration information',
    });
  });

  test('TC_AUTH_REG_005 – API error không có response data', async () => {
    const networkError = new Error('Network Error');

    API.post.mockRejectedValue(networkError);

    const { result } = renderHook(() => useAuth(), { wrapper });

    let res;
    await act(async () => {
      res = await result.current.register({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef',
      });
    });

    expect(res).toEqual({
      success: false,
      message: 'Đăng ký thất bại',
    });
  });
});
