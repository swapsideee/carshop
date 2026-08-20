import { render, screen } from '@testing-library/react';
import { Mail } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import Row from '../Row';
import StatusBadge from '../StatusBadge';

describe('contacts leaves', () => {
  it('preserves Row link and non-link rendering', () => {
    const { rerender } = render(
      <Row
        icon={Mail}
        label={<span>Email</span>}
        value={<strong>buyer@example.com</strong>}
        href="mailto:test@example.com"
      />,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:test@example.com');
    expect(screen.getByText('buyer@example.com')).toBeInTheDocument();

    rerender(<Row icon={Mail} label="Address" value="Kyiv" />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Kyiv')).toBeInTheDocument();
  });

  it('renders the current status and optional title', () => {
    const { rerender } = render(<StatusBadge open title="09:00–13:00" />);

    expect(screen.getByLabelText('Відкрито зараз')).toHaveAttribute('title', '09:00–13:00');

    rerender(<StatusBadge open={false} />);

    expect(screen.getByLabelText('Зачинено зараз')).not.toHaveAttribute('title');
  });
});
