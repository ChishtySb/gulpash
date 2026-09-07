import React, { useState, useMemo, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, ChevronRight } from 'lucide-react';
import { Product, CurrencyCode, ProductSize } from '../../types';
import { StorageService } from '../../lib/storage';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  initialCategory?: string;
  initialCollection?: string;
  currency: CurrencyCode;
  onSelectProduct: (slug: string) => void;
  onQuickView: (product: Product) => void;
  onQuickAddToCart: (product: Product, size: ProductSize) => void;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (id: string) => void;
  onNavigate: (view: string, param?: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory,
  initialCollection,
  currency,
  onSelectProduct,
  onQuickView,
  onQuickAddToCart,
  isWishlisted,
  onToggleWishlist,
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection || 'all');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory('all');
    }
    if (initialCollection) {
      setSelectedCollection(initialCollection);
    } else {
      setSelectedCollection('all');
    }
  }, [initialCategory, initialCollection]);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high' | 'rating'>('newest');
  const [priceMax, setPriceMax] = useState<number>(35000);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlySale, setOnlySale] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const categories = StorageService.getCategories().filter(c => c.isVisible);
  const collections = StorageService.getCollections().filter(c => c.isVisible);
  const allProducts = StorageService.getProducts(false);

  // Extract unique fabrics
  const fabrics = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach(p => {
      if (p.fabric.includes('Lawn')) set.add('Lawn');
      if (p.fabric.includes('Chiffon')) set.add('Chiffon');
      if (p.fabric.includes('Raw Silk') || p.fabric.includes('Silk')) set.add('Raw Silk');
      if (p.fabric.includes('Velvet')) set.add('Velvet');
      if (p.fabric.includes('Jacquard')) set.add('Jacquard');
      if (p.fabric.includes('Chikankari')) set.add('Chikankari');
    });
    return Array.from(set);
  }, [allProducts]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCategory);
        if (catObj && p.category !== catObj.name) return false;
      }

      // Collection filter
      if (selectedCollection !== 'all') {
        const colObj = collections.find(c => c.slug === selectedCollection);
        if (colObj) {
          const matchId = p.collectionIds && p.collectionIds.includes(colObj.id);
          const matchName = p.collectionNames && (p.collectionNames.includes(colObj.name) || (colObj.slug === 'best-selling' && p.collectionNames.includes('BEST SELLING')));
          const matchSingle = p.collection === colObj.name || (colObj.slug === 'best-selling' && p.collection === 'BEST SELLING');
          if (!matchId && !matchName && !matchSingle) return false;
        }
      }

      // Fabric filter
      if (selectedFabric !== 'all') {
        if (!p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) return false;
      }

      // Price filter
      if (p.price > priceMax) return false;

      // In stock
      if (onlyInStock && p.isSoldOut) return false;

      // Sale only
      if (onlySale && (!p.compareAtPrice || p.compareAtPrice <= p.price)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [allProducts, selectedCategory, selectedCollection, selectedFabric, priceMax, onlyInStock, onlySale, sortBy, categories, collections]);

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);
  const activeCollectionObj = collections.find(c => c.slug === selectedCollection);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedFabric('all');
    setPriceMax(35000);
    setOnlyInStock(false);
    setOnlySale(false);
  };

  return (
    <div className="bg-[#FAF9F6] font-sans pb-24">
      
      {/* 1. EDITORIAL HEADER BANNER */}
      <div className="bg-[#1A1A1A] text-white py-12 sm:py-16 px-4 text-center relative overflow-hidden border-b border-stone-800">
        <div className="max-w-4xl mx-auto relative z-10">
          <nav className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-3 uppercase tracking-wider">
            <button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3 text-stone-500" />
            <span className="text-stone-200">
              {activeCollectionObj?.name || activeCategoryObj?.name || 'All Collections'}
            </span>
          </nav>
          
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light italic tracking-wide text-stone-100">
            {activeCollectionObj?.name || activeCategoryObj?.name || 'GulPash Haute Couture Catalog'}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 max-w-xl mx-auto font-light leading-relaxed">
            {activeCollectionObj?.description || activeCategoryObj?.description || 'Explore Pakistani luxury unstitched lawn, embellished pret, festive chiffon formals, and bridal couture.'}
          </p>
        </div>
      </div>

      {/* 2. SUB-BAR (COUNT, FILTER TOGGLE, SORTING) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Filter Trigger & Active Filters summary */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center gap-2 bg-white border border-stone-300 px-3.5 py-2 rounded-xs text-xs font-medium uppercase tracking-wider text-stone-900 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <span className="text-xs text-stone-500">
            Showing <strong className="text-stone-900 font-serif italic text-sm">{filteredProducts.length}</strong> designs
          </span>
        </div>

        {/* Right: Sort dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 hidden sm:inline uppercase tracking-wider text-[11px]">Sort By:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-medium py-2 px-3 pr-8 rounded-xs focus:outline-hidden cursor-pointer"
            >
              <option value="newest">Latest Arrivals</option>
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

      </div>

      {/* 3. MAIN CATALOG GRID & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex gap-8">
          
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-7">
            
            {/* Reset button */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <span className="text-xs uppercase font-medium tracking-wider text-stone-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" /> Filters
              </span>
              <button 
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-900 hover:underline uppercase tracking-wider cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-[11px] uppercase font-medium tracking-widest text-stone-900 mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left text-xs py-1 transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === 'all' ? 'font-semibold text-stone-900' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] text-stone-400">({allProducts.length})</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left text-xs py-1 transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat.slug ? 'font-semibold text-stone-900' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-stone-400">
                      ({allProducts.filter(p => p.category === cat.name).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h3 className="text-[11px] uppercase font-medium tracking-widest text-stone-900 mb-3">
                Signature Collections
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCollection('all')}
                  className={`w-full text-left text-xs py-1 transition-colors cursor-pointer ${
                    selectedCollection === 'all' ? 'font-semibold text-stone-900' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  All Collections
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.slug)}
                    className={`w-full text-left text-xs py-1 transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCollection === col.slug ? 'font-semibold text-stone-900' : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    <span>{col.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric */}
            <div>
              <h3 className="text-[11px] uppercase font-medium tracking-widest text-stone-900 mb-3">
                Fabric
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedFabric('all')}
                  className={`text-xs px-2.5 py-1 border transition-colors cursor-pointer ${
                    selectedFabric === 'all' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-900'
                  }`}
                >
                  All
                </button>
                {fabrics.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFabric(f)}
                    className={`text-xs px-2.5 py-1 border transition-colors cursor-pointer ${
                      selectedFabric === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-600 hover:border-stone-900'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] uppercase font-medium tracking-widest text-stone-900">
                  Max Price
                </h3>
                <span className="text-xs font-serif italic text-stone-900 font-semibold">Rs. {priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={4000}
                max={35000}
                step={500}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Rs. 4,000</span>
                <span>Rs. 35,000</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="accent-stone-900 cursor-pointer"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlySale}
                  onChange={(e) => setOnlySale(e.target.checked)}
                  className="accent-stone-900 cursor-pointer"
                />
                <span className="text-stone-900 font-medium">On Sale / Discounted</span>
              </label>
            </div>

          </aside>

          {/* MAIN PRODUCT GRID (2 cols on mobile, 3/4 cols on desktop) */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-stone-200 p-12 text-center space-y-4">
                <h3 className="font-serif text-2xl font-light italic text-stone-900">No Designs Match Your Filter</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto font-light">
                  Try adjusting the price slider or resetting category filters to view our full Pakistani haute couture collection.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-[0.2em] py-2.5 px-6 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    onSelect={onSelectProduct}
                    onQuickView={onQuickView}
                    onQuickAddToCart={onQuickAddToCart}
                    isWishlisted={isWishlisted(product.id)}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs bg-[#FAF9F6] h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right border-l border-stone-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-xs font-medium uppercase tracking-widest text-stone-900">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="cursor-pointer">
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-stone-900 mb-2">Category</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`block w-full text-left text-xs py-1 ${selectedCategory === 'all' ? 'font-semibold text-stone-900' : 'text-stone-600'}`}
                  >
                    All Categories
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`block w-full text-left text-xs py-1 ${selectedCategory === c.slug ? 'font-semibold text-stone-900' : 'text-stone-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric */}
              <div>
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-stone-900 mb-2">Fabric</h4>
                <div className="flex flex-wrap gap-1">
                  {fabrics.map(f => (
                    <button
                      key={f}
                      onClick={() => setSelectedFabric(f)}
                      className={`text-xs px-2 py-1 border ${selectedFabric === f ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-300 text-stone-700'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-stone-900"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={onlySale}
                    onChange={(e) => setOnlySale(e.target.checked)}
                    className="accent-stone-900"
                  />
                  <span>On Sale</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-stone-900 text-white py-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors cursor-pointer"
              >
                Apply Filters ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
