import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/ui/pagination';

describe('Pagination', () => {
  it('returns null when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders page buttons', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />
    );
    const currentBtn = screen.getByText('3');
    expect(currentBtn).toHaveClass('bg-emerald-600');
  });

  it('calls onPageChange when page button clicked', async () => {
    const handleChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handleChange} />
    );
    await userEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith(3);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );
    const prevBtn = screen.getByText('Précédent').closest('button');
    expect(prevBtn).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );
    const nextBtn = screen.getByText('Suivant').closest('button');
    expect(nextBtn).toBeDisabled();
  });

  it('shows ellipsis for many pages', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />
    );
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });
});
