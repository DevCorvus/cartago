'use client';

export default function AddProduct() {
  return (
    <div className="p-5 pt-12 bg-lime-50 w-full h-full flex flex-col gap-5 items-center justify-center text-green-800">
      <form
        action=""
        className="flex items-center justify-center flex-col gap-6"
      >
        <header className="w-full ">
          <h1 className=" text-2xl font-bold">Add Product</h1>
        </header>
        <div className="flex flex-col gap-4 w-auto">
          <div className="w-full flex flex-col gap-3">
            <label htmlFor="">Image</label>
            <input
              type="image"
              className="w-full rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Name</label>
            <input
              type="text"
              placeholder="write name product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Price</label>
            <input
              type="text"
              placeholder="write price product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Categories</label>
            <input
              type="text"
              placeholder="write categories product"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              id=""
              cols={30}
              rows={10}
              placeholder="write description"
              className="rounded-lg p-4 outline-none text-sm shadow-md"
            ></textarea>
          </div>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="bg-green-800 p-3 w-full rounded-3xl text-slate-50 shadow-lg"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}
