import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Genre, Products } from '../types/types';

export default function GenreCatalog() {
  const [products, setProducts] = useState<Products[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [genre, setGenre] = useState<Genre | undefined>(undefined);

  const { genreId } = useParams();
  const id = Number(genreId);

  const navigate = useNavigate();

  useEffect(() => {
    async function getProductsByGenre() {
      try {
        const res = await fetch(`/api/shop-by-genre/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        if (Array.isArray(result)) {
          setProducts(result);
        } else {
          console.error('Invalid result is not an array', result);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getProductsByGenre();
  }, [id]);

  useEffect(() => {
    async function getGenreName() {
      try {
        const res = await fetch(`/api/get-genre-name/${id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const result = await res.json();
        setGenre(result);
      } catch (error) {
        console.error(error);
      }
    }
    getGenreName();
  }, [id]);

  const handleSort = useCallback((option) => {
    setSortBy(option);
    setProducts((prevProducts) => {
      const sortedProductsCopy = [...prevProducts];
      if (option === 'price') {
        sortedProductsCopy.sort((a, b) => a.price - b.price);
      } else if (option === 'name') {
        sortedProductsCopy.sort((a, b) =>
          `${a.albumName} - ${a.artist}`.localeCompare(
            `${b.albumName} - ${b.artist}`
          )
        );
      }
      return sortedProductsCopy;
    });
  }, []);

  useEffect(() => {
    if (sortBy) {
      handleSort(sortBy);
    }
  }, [sortBy, handleSort]);
  return (
    <div className="bg-[ghostwhite] min-h-screen ">
      <div className="flex justify-end pt-[1rem] px-[17%]">
        <label className="mr-2">Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded">
          <option value="">Select</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>
      <div className="mx-auto max-w-2xl px-4 py-[2rem] sm:px-6 sm:py-[2rem] lg:max-w-[110rem] lg:px-8 mobile-format">
        <h2 className="text-4xl mb-[3rem] ml-[2.4%] mobile-category underline">
          {`${genre?.name} Records`}
        </h2>

        {products.length === 0 && (
          <h2 className="text-lg mb-[3rem] text-center text-rose-600">
            {`No ${genre?.name} records available for sale :(`}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <a
              key={product.recordId}
              style={{ height: '100%' }}
              onClick={() =>
                navigate(`/ProductDetailsPage/${product.recordId}`)
              }
              className="group flex flex-col items-center">
              <div className="">
                <div className="flex-shrink-0 parent w-[14rem] h-[14rem] sm:w-[10rem] md:w-[12rem] md:h-[12rem] lg:h-[20rem] lg:w-[20rem] ">
                  <img
                    src={product.imageSrc}
                    className="img-shop h-full w-full h-fit inset-x-0 inset-y-0 object-cover cursor-pointer object-center group-hover:opacity-75"
                  />
                </div>
              </div>
              <h3 className="mt-4 text-2xl text-gray-700 overflow-hidden ">
                {`${product.albumName} - ${product.artist}`}
              </h3>
              <p className="mt-1 text-xl font-medium text-gray-900">
                {`$${product.price}`}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
