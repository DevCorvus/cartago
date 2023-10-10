import { url } from 'inspector';
import Image from 'next/image';
import { type } from 'os';

interface Props {
  id: string;
  images: string[];
  name: string;
  description: string;
  stock: number;
  createdAt: string;
  tags: string[];
}

export default function ProductItemDetails({
  id,
  images,
  name,
  description,
  stock,
  createdAt,
  tags,
}: Props) {
  return (
    <div>
      <div>
        {images.map((url, i) => (
          <Image src={url} alt={`${name} image #${i + 1}`} />
        ))}
        <button></button>
      </div>
      <h1>{name}</h1>
      <section>
        <p>{description}</p>
        <div>
          <p>{stock} in stock</p>
          <p>Create at {createdAt}</p>
        </div>
      </section>
      <div>{tags[0]}</div>
      <button>Add to shopping cart</button>
    </div>
  );
}
