import React from 'react';
import 'jest-styled-components';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Orientation } from 'models/types';
import { intersectionObserverMock } from 'testutils';
import Picture, { altText, Props } from './picture';
import { imageDimensions } from './picture.css';

describe('Picture tests', () => {
  const defaultProps: Props = {
    photo: {
      album: 'test',
      colors: [
        { code: '#fff', weight: 0.4 },
        { code: '#000', weight: 0.6 },
      ],
      created_at: new Date('1982-04-26'),
      format: 'jpg',
      height: 768,
      image_metadata: {},
      name: 'test',
      orientation: Orientation.Landscape,
      public_id: '123',
      tags: [],
      version: '456',
      width: 1024,
    },
  };

  it('renders the component', (): void => {
    expect(render(<Picture {...defaultProps} />)).toBeTruthy();
    expect(render(<Picture {...defaultProps} isDetail />)).toBeTruthy();
  });

  it('does not initially load the image when lazy loading is enabled', (): void => {
    intersectionObserverMock({
      disconnect: jest.fn(),
      observe: jest.fn(),
      observerEntries: [{ intersectionRatio: 0 } as IntersectionObserverEntry],
      unobserve: jest.fn(),
    });

    const { container } = render(<Picture {...defaultProps} lazyLoad={true} />);
    const image = container.querySelector('img');
    const sources = container.querySelectorAll('source');

    expect(image.src).toEqual('');
    expect(sources[0].srcset).toEqual('');
    expect(sources[1].srcset).toEqual('');
  });

  it('loads the image when lazy loading is not enabled', async (): Promise<void> => {
    const { container } = render(<Picture {...defaultProps} />);
    const image = container.querySelector('img');
    const sources = container.querySelectorAll('source');
    const expectedSizes: number[] = [960, 960, 1024, 1024, 680, 680, 576, 576, 448, 448, 724, 724, 560, 560, 320, 320];

    fireEvent.load(image);

    await waitFor((): void => {
      expect(image.src).toContain('v456/123.jpg');
      expect(sources).toHaveLength(16);
      expect(image).toHaveStyleRule('opacity', '1');

      sources.forEach((source: HTMLSourceElement, index: number): void => {
        expect(source.srcset).toContain(`w_${expectedSizes[index]}`);
        expect(source.srcset).toContain('v456/123');
      });
    });
  });

  it('returns the correct alt text', () => {
    expect(altText()).toEqual('missing title');
    expect(altText('invalid')).toEqual('missing title');
    expect(altText('album/descriptive-image-text')).toEqual('descriptive image text');
  });

  describe('picture styles', (): void => {
    it('returns the correct style given display type and picture orientation', (): void => {
      expect(imageDimensions(Orientation.Landscape, false)).toEqual(['width:100%;height:100%;']);
      expect(imageDimensions(Orientation.Landscape, true)).toEqual(['width:100%;height:auto;']);
      expect(imageDimensions(Orientation.Portrait, true)).toEqual(['width:auto;height:100%;']);
    });
  });
});
