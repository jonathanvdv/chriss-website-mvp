'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useCallback, useState, useTransition } from 'react'
import { SlidersHorizontal, X, Search, RotateCcw, ChevronDown, List, Map as MapIcon, Loader2 } from 'lucide-react'

const selectClass = "w-full border-0 bg-transparent text-sm text-gray-700 focus:outline-none focus:ring-0 appearance-none cursor-pointer pt-0.5 pb-2 pr-7 pl-2"

const saleMinPresets = [
    { value: '', label: 'No min' },
    { value: '200000', label: '$200,000' },
    { value: '300000', label: '$300,000' },
    { value: '400000', label: '$400,000' },
    { value: '500000', label: '$500,000' },
    { value: '600000', label: '$600,000' },
    { value: '700000', label: '$700,000' },
    { value: '800000', label: '$800,000' },
    { value: '1000000', label: '$1,000,000' },
    { value: '1500000', label: '$1,500,000' },
]

const saleMaxPresets = [
    { value: '', label: 'No max' },
    { value: '400000', label: '$400,000' },
    { value: '500000', label: '$500,000' },
    { value: '600000', label: '$600,000' },
    { value: '700000', label: '$700,000' },
    { value: '800000', label: '$800,000' },
    { value: '1000000', label: '$1,000,000' },
    { value: '1500000', label: '$1,500,000' },
    { value: '2000000', label: '$2,000,000' },
    { value: '3000000', label: '$3,000,000+' },
]

const rentalMinPresets = [
    { value: '', label: 'No min' },
    { value: '500', label: '$500' },
    { value: '1000', label: '$1,000' },
    { value: '1500', label: '$1,500' },
    { value: '2000', label: '$2,000' },
    { value: '2500', label: '$2,500' },
    { value: '3000', label: '$3,000' },
    { value: '3500', label: '$3,500' },
    { value: '4000', label: '$4,000' },
    { value: '5000', label: '$5,000' },
]

const rentalMaxPresets = [
    { value: '', label: 'No max' },
    { value: '1000', label: '$1,000' },
    { value: '1500', label: '$1,500' },
    { value: '2000', label: '$2,000' },
    { value: '2500', label: '$2,500' },
    { value: '3000', label: '$3,000' },
    { value: '3500', label: '$3,500' },
    { value: '4000', label: '$4,000' },
    { value: '5000', label: '$5,000' },
    { value: '7500', label: '$7,500' },
    { value: '10000', label: '$10,000+' },
]

function formatPrice(val: string): string {
    const num = parseInt(val, 10)
    if (isNaN(num) || num <= 0) return ''
    return '$' + num.toLocaleString('en-CA')
}

function PriceInput({ label, value, onChange, presets, placeholder, className = '' }: {
    label?: string
    value: string
    onChange: (v: string) => void
    presets: { value: string; label: string }[]
    placeholder: string
    className?: string
}) {
    const [open, setOpen] = useState(false)
    const [inputText, setInputText] = useState(value ? formatPrice(value) : '')
    const ref = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        setInputText(value ? formatPrice(value) : '')
    }, [value])

    React.useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (text: string) => {
        const digits = text.replace(/[^0-9]/g, '')
        setInputText(digits ? formatPrice(digits) : '')
    }

    const handleInputCommit = () => {
        const digits = inputText.replace(/[^0-9]/g, '')
        onChange(digits)
        setOpen(false)
    }

    const handlePresetClick = (preset: { value: string; label: string }) => {
        onChange(preset.value)
        setInputText(preset.value ? formatPrice(preset.value) : '')
        setOpen(false)
    }

    return (
        <div className={className} ref={ref}>
            {label && <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    value={inputText}
                    placeholder={placeholder}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit() }}
                    className="w-full border border-gray-300 rounded px-3 py-[7px] bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent pr-8 cursor-text"
                />
                <ChevronDown
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {presets.map((p) => (
                            <button
                                key={p.value || '__empty'}
                                onClick={() => handlePresetClick(p)}
                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${p.value === value ? 'text-brand-accent font-medium' : 'text-gray-700'}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function InlineSelect({ label, value, onChange, children, className = '' }: {
    label?: string
    value: string
    onChange: (v: string) => void
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={className}>
            {label && <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</label>}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-[7px] bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent appearance-none pr-8"
                >
                    {children}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
        </div>
    )
}

// Standalone FilterSelect for the advanced panel
function FilterSelect({ label, value, onChange, children, className = '' }: {
    label?: string
    value: string
    onChange: (v: string) => void
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={className}>
            {label && <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>}
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent appearance-none"
                >
                    {children}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
        </div>
    )
}

export function ListingSearch({ initialFilters = {}, resultCount, totalCount }: { initialFilters?: Record<string, string>; resultCount?: number; totalCount?: number }) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [searchText, setSearchText] = useState(searchParams.get('q') || '')
    const [isSearching, startSearchTransition] = useTransition()

    const buildQuery = useCallback(
        (updates: Record<string, string>) => {
            const params = new URLSearchParams(searchParams.toString())
            Object.entries(updates).forEach(([key, val]) => {
                if (val) params.set(key, val)
                else params.delete(key)
            })
            return params.toString()
        },
        [searchParams]
    )

    const handleChange = (name: string, value: string) => {
        if (name === 'tt') {
            const params = new URLSearchParams(searchParams.toString())
            if (value) params.set('tt', value)
            else params.delete('tt')
            params.delete('lp')
            params.delete('hp')
            router.push(pathname + '?' + params.toString())
            return
        }
        router.push(pathname + '?' + buildQuery({ [name]: value }))
    }

    const handleSearch = () => {
        startSearchTransition(() => {
            router.push(pathname + '?' + buildQuery({ q: searchText.trim() }))
        })
    }

    const isRental = (searchParams.get('tt') || initialFilters['tt']) === 'rent'
    const minPresets = isRental ? rentalMinPresets : saleMinPresets
    const maxPresets = isRental ? rentalMaxPresets : saleMaxPresets

    const handleAdvancedApply = () => {
        setShowAdvanced(false)
    }

    const handleClear = () => {
        router.push(pathname)
        setSearchText('')
        setShowAdvanced(false)
    }

    const currentVal = (key: string) => searchParams.get(key) || initialFilters[key] || ''

    const hasActiveFilters = ['tt', 'pt', 'city', 'lp', 'hp', 'bd', 'ba', 'q'].some(k => currentVal(k))
    const currentView = currentVal('view') || 'map'

    return (
        <div className="relative z-30 mb-4">
            {/* ─── Desktop: single-row filter bar ─── */}
            <div className="hidden lg:flex items-end gap-3 bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3">
                {/* Search input */}
                <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Search</label>
                    <div className="flex items-center border border-gray-300 rounded px-3 py-[7px] bg-white">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                            placeholder="City, Address or MLS®"
                            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent min-w-0"
                        />
                        {searchText && (
                            <button onClick={() => { setSearchText(''); handleChange('q', '') }} className="text-gray-400 hover:text-gray-600 ml-1">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Transaction Type */}
                <InlineSelect label="Transaction Type" value={currentVal('tt')} onChange={(v) => handleChange('tt', v)} className="w-[130px]">
                    <option value="">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                </InlineSelect>

                {/* Property Type */}
                <InlineSelect label="Property Type" value={currentVal('pt')} onChange={(v) => handleChange('pt', v)} className="w-[130px]">
                    <option value="">Any</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Row / Townhouse">Townhouse</option>
                    <option value="Duplex">Duplex</option>
                    <option value="Triplex">Triplex</option>
                    <option value="Land">Land</option>
                </InlineSelect>

                {/* Min Price */}
                <PriceInput label="Min Price" value={currentVal('lp')} onChange={(v) => handleChange('lp', v)} presets={minPresets} placeholder="No min" className="w-[130px]" />

                {/* Max Price */}
                <PriceInput label="Max Price" value={currentVal('hp')} onChange={(v) => handleChange('hp', v)} presets={maxPresets} placeholder="No max" className="w-[130px]" />

                {/* Beds */}
                <InlineSelect label="Beds" value={currentVal('bd')} onChange={(v) => handleChange('bd', v)} className="w-[80px]">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                </InlineSelect>

                {/* Baths */}
                <InlineSelect label="Baths" value={currentVal('ba')} onChange={(v) => handleChange('ba', v)} className="w-[80px]">
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                </InlineSelect>

                {/* Filters button */}
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className={`flex items-center gap-2 px-4 py-[7px] rounded text-sm font-medium border transition-colors whitespace-nowrap ${showAdvanced ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                {/* Spacer */}
                <div className="flex-shrink-0 w-px h-8 bg-gray-200 mx-1" />

                {/* Map / List toggle */}
                <div className="flex border border-gray-300 rounded overflow-hidden flex-shrink-0">
                    <button
                        onClick={() => handleChange('view', 'list')}
                        className={`flex items-center gap-1 px-3 py-[7px] text-xs font-medium transition-colors ${currentView === 'list' ? 'bg-brand-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <List className="w-3.5 h-3.5" /> List
                    </button>
                    <button
                        onClick={() => handleChange('view', 'map')}
                        className={`flex items-center gap-1 px-3 py-[7px] text-xs font-medium transition-colors ${currentView === 'map' ? 'bg-brand-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        <MapIcon className="w-3.5 h-3.5" /> Map
                    </button>
                </div>

                {/* Sort By */}
                <InlineSelect label="Sort By" value={
                    currentVal('sortField') === 'listingPrice'
                        ? currentVal('sortDirection') === 'asc' ? 'price-asc' : 'price-desc'
                        : 'listingDate'
                } onChange={(v) => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (v === 'listingDate') {
                        params.set('sortField', 'listingDate')
                        params.set('sortDirection', 'desc')
                    } else if (v === 'price-asc') {
                        params.set('sortField', 'listingPrice')
                        params.set('sortDirection', 'asc')
                    } else if (v === 'price-desc') {
                        params.set('sortField', 'listingPrice')
                        params.set('sortDirection', 'desc')
                    }
                    router.push(pathname + '?' + params.toString())
                }} className="w-[110px] flex-shrink-0">
                    <option value="listingDate">Newest</option>
                    <option value="price-asc">Price: Low</option>
                    <option value="price-desc">Price: High</option>
                </InlineSelect>
            </div>

            {/* ─── Mobile/tablet: search + compact filters ─── */}
            <div className="lg:hidden space-y-2">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2.5 flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                        placeholder="City, Address or MLS®"
                        className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
                    />
                    {searchText && (
                        <button onClick={() => { setSearchText(''); handleChange('q', '') }} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-brand-accent rounded transition-colors disabled:opacity-70"
                    >
                        {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                        <select value={currentVal('tt')} onChange={(e) => handleChange('tt', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 bg-white text-xs text-gray-700 appearance-none">
                            <option value="">All</option>
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative flex-1 min-w-0">
                        <select value={currentVal('pt')} onChange={(e) => handleChange('pt', e.target.value)} className="w-full border border-gray-200 rounded px-3 py-1.5 bg-white text-xs text-gray-700 appearance-none">
                            <option value="">Any Type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apt</option>
                            <option value="Row / Townhouse">Town</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Land">Land</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors flex-shrink-0 ${showAdvanced ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                    </button>
                </div>
            </div>

            {/* ─── Advanced Filters Panel ─── */}
            {showAdvanced && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                        <button onClick={() => setShowAdvanced(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                        <FilterSelect label="Property Type" value={currentVal('pt')} onChange={(v) => handleChange('pt', v)}>
                            <option value="">Any</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Row / Townhouse">Townhouse</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Triplex">Triplex</option>
                            <option value="Land">Land</option>
                        </FilterSelect>

                        <FilterSelect label="Area" value={currentVal('city')} onChange={(v) => handleChange('city', v)}>
                            <option value="">All Areas</option>
                            <option value="Kitchener">Kitchener</option>
                            <option value="Waterloo">Waterloo</option>
                            <option value="Cambridge">Cambridge</option>
                            <option value="Guelph">Guelph</option>
                            <option value="Brampton">Brampton</option>
                            <option value="Mississauga">Mississauga</option>
                            <option value="Toronto">Toronto</option>
                        </FilterSelect>

                        <FilterSelect label="Beds" value={currentVal('bd')} onChange={(v) => handleChange('bd', v)}>
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </FilterSelect>

                        <FilterSelect label="Baths" value={currentVal('ba')} onChange={(v) => handleChange('ba', v)}>
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </FilterSelect>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Price</label>
                            <div className="flex items-center gap-2">
                                <PriceInput value={currentVal('lp')} onChange={(v) => handleChange('lp', v)} presets={minPresets} placeholder="No min" className="flex-1" />
                                <span className="text-gray-400 text-sm">-</span>
                                <PriceInput value={currentVal('hp')} onChange={(v) => handleChange('hp', v)} presets={maxPresets} placeholder="No max" className="flex-1" />
                            </div>
                        </div>

                        <FilterSelect label="Building Type" value={currentVal('bt')} onChange={(v) => handleChange('bt', v)}>
                            <option value="">Any</option>
                            <option value="Single Family">Single Family</option>
                            <option value="Multi-family">Multi-Family</option>
                            <option value="Recreational">Recreational</option>
                            <option value="Agriculture">Agriculture</option>
                        </FilterSelect>

                        <FilterSelect label="Storeys" value={currentVal('storeys')} onChange={(v) => handleChange('storeys', v)}>
                            <option value="">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </FilterSelect>

                        <FilterSelect label="Year Built" value={currentVal('yb')} onChange={(v) => handleChange('yb', v)}>
                            <option value="">Any</option>
                            <option value="2020">2020+</option>
                            <option value="2010">2010+</option>
                            <option value="2000">2000+</option>
                            <option value="1990">1990+</option>
                            <option value="1980">1980+</option>
                        </FilterSelect>
                    </div>

                    <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleClear}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-full transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button
                            onClick={handleAdvancedApply}
                            className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent/90 rounded-full transition-colors"
                        >
                            <Search className="w-4 h-4" /> Search
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
