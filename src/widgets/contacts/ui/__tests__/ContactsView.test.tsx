import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CONTACTS } from '@/shared/config/contacts';

import ContactsView from '../ContactsView';

const writeTextMock = vi.fn();
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

describe('ContactsView', () => {
  beforeEach(() => {
    writeTextMock.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: writeTextMock },
    });
  });

  afterEach(() => {
    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
  });

  it('keeps the clipboard success feedback wired to the existing address value', async () => {
    writeTextMock.mockResolvedValue(undefined);
    render(<ContactsView />);

    const copyButton = screen.getByRole('button', { name: 'Copy address' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(`${CONTACTS.city}, ${CONTACTS.address}`);
    });

    const icons = copyButton.querySelectorAll('svg');
    expect(icons[1]).toHaveClass('scale-100');
    expect(screen.getByTitle('Google Map')).toHaveAttribute('src', CONTACTS.mapEmbedSrc);
  });

  it('keeps clipboard failures silent and does not show success feedback', async () => {
    writeTextMock.mockRejectedValue(new Error('Clipboard unavailable'));
    render(<ContactsView />);

    const copyButton = screen.getByRole('button', { name: 'Copy address' });
    fireEvent.click(copyButton);

    await waitFor(() => expect(writeTextMock).toHaveBeenCalledOnce());

    const icons = copyButton.querySelectorAll('svg');
    expect(icons[0]).toHaveClass('scale-100');
    expect(icons[1]).toHaveClass('scale-0');
  });
});
