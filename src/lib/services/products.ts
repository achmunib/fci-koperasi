import { ApiService } from './api';
import type { Product, ProductFilters, CreateProductDto, UpdateProductDto } from '$lib/types';

class ProductService extends ApiService {
	constructor() {
		super();
	}

	/**
	 * Get all products with optional filters
	 */
	async getProducts(filters?: ProductFilters): Promise<Product[]> {
		const params = new URLSearchParams();
		if (filters?.search) params.append('search', filters.search);
		if (filters?.category) params.append('category', filters.category);
		if (filters?.producerId) params.append('producerId', filters.producerId);
		if (filters?.status) params.append('status', filters.status);

		const query = params.toString();
		const endpoint = query ? `/products?${query}` : '/products';

		const response = await this.get<Product[]>(endpoint);
		return response.data || [];
	}

	/**
	 * Get a single product by ID
	 */
	async getProduct(id: string): Promise<Product> {
		const response = await this.get<Product>(`/products/${id}`);
		if (!response.data) {
			throw new Error('Produk tidak ditemukan');
		}
		return response.data;
	}

	/**
	 * Create a new product
	 */
	async createProduct(data: CreateProductDto): Promise<Product> {
		const response = await this.post<Product>('/products', data);
		if (!response.data) {
			throw new Error('Gagal membuat produk');
		}
		return response.data;
	}

	/**
	 * Update an existing product
	 */
	async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
		const response = await this.put<Product>(`/products/${id}`, data);
		if (!response.data) {
			throw new Error('Gagal memperbarui produk');
		}
		return response.data;
	}

	/**
	 * Delete a product
	 */
	async deleteProduct(id: string): Promise<void> {
		await this.delete(`/products/${id}`);
	}
}

export const productService = new ProductService();
