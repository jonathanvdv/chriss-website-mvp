'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { SlidersHorizontal, X, Search, RotateCcw, ChevronDown, List, Map as MapIcon } from 'lucide-react'

const selectClass = "w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent appearance-none"

const minPresets = [
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

const maxPresets = [
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
        // Strip non-numeric chars
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
            {label && <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    value={inputText}
                    placeholder={placeholder}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInputCommit() }}
                    className={selectClass + ' pr-8 cursor-text'}
                />
                <ChevronDown
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
                    onClick={() => setOpen(!open)}
                />
                {open && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto">
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
                    className={selectClass}
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
        router.push(pathname + '?' + buildQuery({ [name]: value }))
    }

    const handleAdvancedApply = () => {
        setShowAdvanced(false)
    }

    const handleClear = () => {
        router.push(pathname)
        setShowAdvanced(false)
    }

    const currentVal = (key: string) => searchParams.get(key) || initialFilters[key] || ''

    const hasActiveFilters = ['tt', 'pt', 'city', 'lp', 'hp', 'bd', 'ba'].some(k => currentVal(k))
    const currentView = currentVal('view') || 'map'

    return (
        <div className="relative z-30 mb-4 sm:mb-8">
            {/* Main Filter Bar — realtor.ca style inline row */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Mobile: compact 1-row with key filters + Filters button */}
                <div className="flex sm:hidden items-center gap-2 p-2.5">
                    <FilterSelect value={currentVal('tt')} onChange={(v) => handleChange('tt', v)} className="flex-1 min-w-0">
                        <option value="">All</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                    </FilterSelect>
                    <FilterSelect value={currentVal('pt')} onChange={(v) => handleChange('pt', v)} className="flex-1 min-w-0">
                        <option value="">Any Type</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apt</option>
                        <option value="Row / Townhouse">Town</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Land">Land</option>
                    </FilterSelect>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium border transition-colors flex-shrink-0 ${showAdvanced ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                        )}
                    </button>
                </div>

                {/* Desktop: full filter row */}
                <div className="hidden sm:flex flex-wrap items-end gap-3 p-4">
                    {/* Transaction Type */}
                    <FilterSelect label="Transaction Type" value={currentVal('tt')} onChange={(v) => handleChange('tt', v)} className="min-w-[110px]">
                        <option value="">All</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                    </FilterSelect>

                    {/* Property Type */}
                    <FilterSelect label="Property Type" value={currentVal('pt')} onChange={(v) => handleChange('pt', v)} className="min-w-[120px]">
                        <option value="">Any</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Row / Townhouse">Townhouse</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Triplex">Triplex</option>
                        <option value="Land">Land</option>
                    </FilterSelect>

                    {/* Min Price */}
                    <PriceInput label="Min Price" value={currentVal('lp')} onChange={(v) => handleChange('lp', v)} presets={minPresets} placeholder="No min" className="min-w-[110px] flex-1" />

                    {/* Max Price */}
                    <PriceInput label="Max Price" value={currentVal('hp')} onChange={(v) => handleChange('hp', v)} presets={maxPresets} placeholder="No max" className="min-w-[110px] flex-1" />

                    {/* Beds */}
                    <FilterSelect label="Beds" value={currentVal('bd')} onChange={(v) => handleChange('bd', v)} className="min-w-[80px]">
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                        <option value="5">5+</option>
                    </FilterSelect>

                    {/* Baths */}
                    <FilterSelect label="Baths" value={currentVal('ba')} onChange={(v) => handleChange('ba', v)} className="min-w-[80px]">
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </FilterSelect>

                    {/* Filters button */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium border transition-colors ${showAdvanced ? 'bg-brand-accent text-white border-brand-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-brand-accent" />
                        )}
                    </button>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Map / List toggle */}
                    <div className="hidden lg:flex border border-gray-300 rounded overflow-hidden self-end">
                        <button
                            onClick={() => handleChange('view', 'list')}
                            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${currentView === 'list' ? 'bg-brand-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <List className="w-3.5 h-3.5" /> List
                        </button>
                        <button
                            onClick={() => handleChange('view', 'map')}
                            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${currentView === 'map' ? 'bg-brand-accent text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <MapIcon className="w-3.5 h-3.5" /> Map
                        </button>
                    </div>

                    {/* Sort By */}
                    <div className="self-end">
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort By</label>
                        <div className="relative">
                            <select
                                value={
                                    currentVal('sortField') === 'listingPrice'
                                        ? currentVal('sortDirection') === 'asc' ? 'price-asc' : 'price-desc'
                                        : 'listingDate'
                                }
                                onChange={(e) => {
                                    const val = e.target.value
                                    const params = new URLSearchParams(searchParams.toString())
                                    if (val === 'listingDate') {
                                        params.set('sortField', 'listingDate')
                                        params.set('sortDirection', 'desc')
                                    } else if (val === 'price-asc') {
                                        params.set('sortField', 'listingPrice')
                                        params.set('sortDirection', 'asc')
                                    } else if (val === 'price-desc') {
                                        params.set('sortField', 'listingPrice')
                                        params.set('sortDirection', 'desc')
                                    }
                                    router.push(pathname + '?' + params.toString())
                                }}
                                className={selectClass + ' min-w-[120px]'}
                            >
                                <option value="listingDate">Newest</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
                        <button onClick={() => setShowAdvanced(false)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                        {/* Property Type */}
                        <FilterSelect label="Property Type" value={currentVal('pt')} onChange={(v) => handleChange('pt', v)}>
                            <option value="">Any</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Row / Townhouse">Townhouse</option>
                            <option value="Duplex">Duplex</option>
                            <option value="Triplex">Triplex</option>
                            <option value="Land">Land</option>
                        </FilterSelect>

                        {/* Area */}
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

                        {/* Beds */}
                        <FilterSelect label="Beds" value={currentVal('bd')} onChange={(v) => handleChange('bd', v)}>
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5+</option>
                        </FilterSelect>

                        {/* Baths */}
                        <FilterSelect label="Baths" value={currentVal('ba')} onChange={(v) => handleChange('ba', v)}>
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </FilterSelect>

                        {/* Price Range */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1.5">Price</label>
                            <div className="flex items-center gap-2">
                                <PriceInput value={currentVal('lp')} onChange={(v) => handleChange('lp', v)} presets={minPresets} placeholder="No min" className="flex-1" />
                                <span className="text-gray-400 text-sm">-</span>
                                <PriceInput value={currentVal('hp')} onChange={(v) => handleChange('hp', v)} presets={maxPresets} placeholder="No max" className="flex-1" />
                            </div>
                        </div>

                        {/* Building Type (PropertySubType) */}
                        <FilterSelect label="Building Type" value={currentVal('bt')} onChange={(v) => handleChange('bt', v)}>
                            <option value="">Any</option>
                            <option value="Single Family">Single Family</option>
                            <option value="Multi-family">Multi-Family</option>
                            <option value="Recreational">Recreational</option>
                            <option value="Agriculture">Agriculture</option>
                        </FilterSelect>

                        {/* Storeys placeholder */}
                        <FilterSelect label="Storeys" value={currentVal('storeys')} onChange={(v) => handleChange('storeys', v)}>
                            <option value="">Any</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3+</option>
                        </FilterSelect>

                        {/* Year Built */}
                        <FilterSelect label="Year Built" value={currentVal('yb')} onChange={(v) => handleChange('yb', v)}>
                            <option value="">Any</option>
                            <option value="2020">2020+</option>
                            <option value="2010">2010+</option>
                            <option value="2000">2000+</option>
                            <option value="1990">1990+</option>
                            <option value="1980">1980+</option>
                        </FilterSelect>
                    </div>

                    {/* Action buttons */}
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
