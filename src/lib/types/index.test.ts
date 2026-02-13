import { describe, it, expect } from 'vitest';
import type { Member, Product, Transaction } from './index';

describe('Type definitions', () => {
	it('should allow creating a valid Member object', () => {
		const member: Member = {
			id: '1',
			name: 'Test Member',
			idNumber: 'ID001',
			address: 'Test Address',
			phone: '08123456789',
			email: 'test@example.com',
			joinDate: new Date(),
			status: 'active',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		expect(member.name).toBe('Test Member');
		expect(member.status).toBe('active');
	});

	it('should allow creating a valid Product object', () => {
		const product: Product = {
			id: '1',
			name: 'Test Product',
			description: 'Test Description',
			category: 'Test Category',
			price: 10000,
			unit: 'kg',
			producerId: '1',
			producerName: 'Test Producer',
			status: 'available',
			createdAt: new Date(),
			updatedAt: new Date()
		};

		expect(product.name).toBe('Test Product');
		expect(product.price).toBe(10000);
	});

	it('should allow creating a valid Transaction object', () => {
		const transaction: Transaction = {
			id: '1',
			date: new Date(),
			memberId: '1',
			memberName: 'Test Member',
			productId: '1',
			productName: 'Test Product',
			quantity: 5,
			pricePerUnit: 10000,
			total: 50000,
			createdAt: new Date()
		};

		expect(transaction.quantity).toBe(5);
		expect(transaction.total).toBe(50000);
	});
});
