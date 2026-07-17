import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './Register.jsx';

const mockNavigate = jest.fn();
const mockRegister = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

describe('Register Component Tests (Phạm Văn Quyết - DE190425)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = async (user, data = {}) => {
    const fullNameInput = screen.getByPlaceholderText('Họ và tên');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Mật khẩu');
    const confirmInput = screen.getByPlaceholderText('Xác nhận mật khẩu');

    await user.type(fullNameInput, data.fullName || 'Phạm Văn Quyết');
    await user.type(emailInput, data.email || 'de190425@fpt.edu.vn');
    await user.type(passwordInput, data.password || 'abcdef');
    await user.type(confirmInput, data.confirm || 'abcdef');
  };

  test('TC_REG_001 – Confirm password mismatch', async () => {
    const user = userEvent.setup();
    render(<Register />);

    await fillForm(user, {
      password: 'abcdef',
      confirm: 'abcdeg'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    expect(screen.getByText(/Mật khẩu xác nhận không khớp/)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_REG_002 – Password dưới minimum boundary (5 ký tự)', async () => {
    const user = userEvent.setup();
    render(<Register />);

    await fillForm(user, {
      password: 'abcde',
      confirm: 'abcde'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    expect(screen.getByText(/Mật khẩu phải ít nhất 6 ký tự/)).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_REG_003 – Password đúng minimum boundary (6 ký tự)', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    render(<Register />);

    await fillForm(user, {
      password: 'abcdef',
      confirm: 'abcdef'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('TC_REG_004 – Password trên minimum boundary (7 ký tự)', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    render(<Register />);

    await fillForm(user, {
      password: 'abcdefg',
      confirm: 'abcdefg'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('TC_REG_005 – Kiểm tra payload mapping', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: true });
    render(<Register />);

    await fillForm(user, {
      fullName: 'Phạm Văn Quyết',
      email: 'de190425@fpt.edu.vn',
      password: 'abcdef',
      confirm: 'abcdef'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'Phạm Văn Quyết',
        email: 'de190425@fpt.edu.vn',
        password: 'abcdef'
      });
    });
  });

  test('TC_REG_006 – Register trả về lỗi có message', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: false, message: 'Email đã tồn tại' });
    render(<Register />);

    await fillForm(user);

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Email đã tồn tại/)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('TC_REG_007 – Register trả về lỗi không có message', async () => {
    const user = userEvent.setup();
    mockRegister.mockResolvedValue({ success: false });
    render(<Register />);

    await fillForm(user);

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Đăng ký thất bại/)).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('TC_REG_008 – Loading state', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockRegister.mockReturnValue(promise);

    render(<Register />);
    await fillForm(user);

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    // Bắt đầu loading, submit button phải disabled
    expect(submitBtn).toBeDisabled();
    expect(submitBtn.querySelector('.spinner')).toBeInTheDocument();

    await act(async () => {
      resolvePromise({ success: true });
    });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('TC_REG_009 – Thứ tự validation', async () => {
    const user = userEvent.setup();
    render(<Register />);

    // Cả 2 đều sai: password ngắn (3 ký tự) và confirm password không khớp
    await fillForm(user, {
      password: 'abc',
      confirm: 'abcd'
    });

    const submitBtn = screen.getByRole('button', { name: 'Đăng ký' });
    await user.click(submitBtn);

    // Kiểm tra xem lỗi không khớp có được hiển thị trước không (theo đúng thứ tự logic if)
    expect(screen.getByText(/Mật khẩu xác nhận không khớp/)).toBeInTheDocument();
    expect(screen.queryByText(/Mật khẩu phải ít nhất 6 ký tự/)).not.toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  test('TC_REG_010 – Toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<Register />);

    const passwordInput = screen.getByPlaceholderText('Mật khẩu');
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Nút toggle password ở div đầu tiên
    const toggleBtns = screen.getAllByRole('button');
    // Button toggle 1: toggle password (cái đầu tiên có emoji 👁️)
    const passToggle = toggleBtns.find(btn => btn.textContent === '👁️' || btn.textContent === '🙈');
    
    await user.click(passToggle);
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(passToggle.textContent).toBe('🙈');

    await user.click(passToggle);
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passToggle.textContent).toBe('👁️');
  });

  test('TC_REG_011 – Toggle confirm password visibility', async () => {
    const user = userEvent.setup();
    render(<Register />);

    const confirmInput = screen.getByPlaceholderText('Xác nhận mật khẩu');
    expect(confirmInput).toHaveAttribute('type', 'password');

    const toggleBtns = screen.getAllByRole('button');
    // Tìm các button toggle
    const toggleButtons = toggleBtns.filter(btn => btn.textContent === '👁️' || btn.textContent === '🙈');
    
    // Toggle thứ hai là confirm password
    const confirmToggle = toggleButtons[1];
    
    await user.click(confirmToggle);
    expect(confirmInput).toHaveAttribute('type', 'text');
    expect(confirmToggle.textContent).toBe('🙈');

    await user.click(confirmToggle);
    expect(confirmInput).toHaveAttribute('type', 'password');
    expect(confirmToggle.textContent).toBe('👁️');
  });

  test('TC_REG_012 – Social registration notification', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Register />);

    const googleBtn = screen.getByRole('button', { name: /Google/i });
    
    expect(screen.queryByText(/Tính năng đang phát triển/)).not.toBeInTheDocument();

    await user.click(googleBtn);
    expect(screen.getByText(/Tính năng đang phát triển/)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.queryByText(/Tính năng đang phát triển/)).not.toBeInTheDocument();

    jest.useRealTimers();
  });
});
