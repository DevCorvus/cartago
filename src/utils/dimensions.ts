export interface Dimensions {
  width: number;
  height: number;
}

export async function getImageDimensions(src: string): Promise<Dimensions> {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      res({ width: img.width, height: img.height });
    };
    img.src = '/images/' + src;
  });
}

export function calculatePaddingBasedOnAspectRatios(
  element: Dimensions,
  container: Dimensions,
) {
  const elementAspectRatio = element.width / element.height;
  const containerAspectRatio = container.width / container.height;

  const padding = { x: 0, y: 0 };

  if (elementAspectRatio > containerAspectRatio) {
    const paddingHeight =
      (container.height - container.width / elementAspectRatio) / 2;

    padding.y = paddingHeight;
  } else if (elementAspectRatio < containerAspectRatio) {
    const paddingWidth =
      (container.width - container.height * elementAspectRatio) / 2;

    padding.x = paddingWidth;
  }

  return padding;
}
