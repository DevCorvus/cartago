import { HiXMark } from 'react-icons/hi2';
import Portal from './Portal';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
  closeModal: () => void;
}

export default function AddCategoryFormModal({ closeModal }: Props) {
  const formRef = useClickOutside<HTMLFormElement>(closeModal);

  return (
    <Portal id="modal-container">
      <div className="z-50 w-screen h-screen fixed top-0 left-0 bg-neutral-100 bg-opacity-50 flex flex-col items-center justify-center">
        <form
          ref={formRef}
          className="relative bg-lime-50 rounded-md shadow-lg p-8 flex flex-col gap-3 text-green-800"
        >
          <button
            className="text-xl absolute top-3 right-3"
            onClick={closeModal}
          >
            <HiXMark />
          </button>
          <header className="mb-3">
            <h1 className="text-2xl font-bold">Add category</h1>
          </header>
          <div className="flex flex-col gap-2">
            <label htmlFor="category-title">Title</label>
            <input
              type="text"
              name="category-title"
              id="category-title"
              placeholder="Enter category title"
              className="p-3 rounded-md shadow-md outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category-description">Description (optional)</label>
            <textarea
              name="category-description"
              id="category-description"
              className="p-3 rounded-md shadow-md outline-none resize-none h-28"
              placeholder="Enter category description"
              rows={5}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-800 rounded-full text-neutral-50 mt-5"
          >
            Create category
          </button>
        </form>
      </div>
    </Portal>
  );
}
