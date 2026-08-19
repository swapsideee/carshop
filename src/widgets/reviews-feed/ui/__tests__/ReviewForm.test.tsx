import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProductSelectApiResult } from '@/entities/product';

import ReviewForm from '../ReviewForm';

const fetchMock = vi.fn<typeof fetch>();

const productSelectResult: ProductSelectApiResult = {
  items: [
    {
      id: 42,
      name: 'Brake pads',
      model: 'Model X',
    },
  ],
};

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status });
}

function fillValidForm(): void {
  fireEvent.change(screen.getByPlaceholderText('Наприклад, Ірина'), {
    target: { value: 'Reviewer' },
  });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '42' } });
  fireEvent.click(screen.getByTitle('5 / 5'));
  fireEvent.change(screen.getByPlaceholderText('Ваш відгук'), {
    target: { value: '  Review comment  ' },
  });
}

describe('ReviewForm', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not POST when client-side validation rejects an empty form', async () => {
    fetchMock.mockResolvedValueOnce(createResponse(productSelectResult));

    const { container } = render(<ReviewForm />);

    await screen.findByRole('option', { name: 'Brake pads Model X' });
    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(screen.getByText('Будь ласка, оберіть товар')).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/products?forSelect=1', { cache: 'no-store' });
  });

  it('posts the existing body, resets the form after success, and notifies the feed once', async () => {
    const onNewReview = vi.fn();

    fetchMock
      .mockResolvedValueOnce(createResponse(productSelectResult))
      .mockResolvedValueOnce(createResponse(null, 201));

    render(<ReviewForm onNewReview={onNewReview} />);

    await screen.findByRole('option', { name: 'Brake pads Model X' });
    vi.useFakeTimers();

    fillValidForm();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати відгук' }));
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: '42',
        rating: 5,
        comment: 'Review comment',
        authorName: 'Reviewer',
      }),
    });
    expect(onNewReview).toHaveBeenCalledTimes(1);
    expect(screen.getByPlaceholderText('Наприклад, Ірина')).toHaveValue('');
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(screen.getByPlaceholderText('Ваш відгук')).toHaveValue('');
    expect(screen.getByTitle('5 / 5')).toHaveAttribute('fill', 'none');
    expect(screen.getByText('Дякуємо за відгук!')).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.queryByText('Дякуємо за відгук!')).not.toBeInTheDocument();
  });

  it('keeps form values and clears the existing error on the current failed-POST timer', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    fetchMock
      .mockResolvedValueOnce(createResponse(productSelectResult))
      .mockResolvedValueOnce(createResponse(null, 500));

    render(<ReviewForm />);

    await screen.findByRole('option', { name: 'Brake pads Model X' });
    vi.useFakeTimers();

    fillValidForm();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Надіслати відгук' }));
      await Promise.resolve();
    });

    expect(screen.getByText('Сталася помилка під час надсилання відгуку.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Наприклад, Ірина')).toHaveValue('Reviewer');
    expect(screen.getByRole('combobox')).toHaveValue('42');
    expect(screen.getByPlaceholderText('Ваш відгук')).toHaveValue('  Review comment  ');

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.queryByText('Сталася помилка під час надсилання відгуку.'),
    ).not.toBeInTheDocument();
  });
});
