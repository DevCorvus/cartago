import Portal from './Portal';

export default function AddCategoryFormModal() {
  return (
    <Portal id="modal-container">
      <div className="w-screen h-screen fixed top-0 left-0 bg-neutral-100 bg-opacity-50 flex flex-col items-center justify-center">
        <form className="bg-lime-50 rounded-md p-8 flex flex-col gap-4 text-green-800">
          <header className="mb-3">
            <h1 className="text-2xl font-bold">Add category</h1>
          </header>
          <div className="flex flex-col gap-2">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Enter category title"
              className="p-4 rounded-md shadow-md outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              placeholder="Enter category description"
              className="p-4 rounded-md shadow-md outline-none"
            />
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
