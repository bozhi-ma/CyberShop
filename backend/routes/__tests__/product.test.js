const request = require('supertest')
const app = require('../../app')
const { Product } = require('../../models')

describe('Product API', () => {
  beforeEach(async () => {
    // 清理测试数据
    await Product.destroy({ where: {} })
  })

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      // 创建测试产品
      await Product.create({
        name: 'Test Product',
        price: 100,
        description: 'Test description',
        category: '测试分类',
        brand: '测试品牌',
        image: 'test-image.jpg'
      })

      const response = await request(app)
        .get('/api/products')
        .expect(200)

      expect(response.body).toBeInstanceOf(Array)
      expect(response.body.length).toBe(1)
      expect(response.body[0].name).toBe('Test Product')
    })

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200)

      expect(response.body).toEqual([])
    })
  })

  describe('GET /api/products/:id', () => {
    it('should return a specific product', async () => {
      const product = await Product.create({
        name: 'Test Product',
        price: 100,
        description: 'Test description',
        category: '测试分类',
        brand: '测试品牌',
        image: 'test-image.jpg'
      })

      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .expect(200)

      expect(response.body.id).toBe(product.id)
      expect(response.body.name).toBe('Test Product')
    })

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/999')
        .expect(404)
    })
  })

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        price: 200,
        description: 'New description',
        category: '新分类',
        brand: '新品牌',
        image: 'new-image.jpg'
      }

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201)

      expect(response.body.name).toBe('New Product')
      expect(response.body.price).toBe(200)
    })

    it('should return 400 for invalid product data', async () => {
      const invalidData = {
        name: '', // 空名称
        price: -100 // 负价格
      }

      await request(app)
        .post('/api/products')
        .send(invalidData)
        .expect(400)
    })
  })

  describe('PUT /api/products/:id', () => {
    it('should update an existing product', async () => {
      const product = await Product.create({
        name: 'Original Product',
        price: 100,
        description: 'Original description',
        category: '原分类',
        brand: '原品牌',
        image: 'original-image.jpg'
      })

      const updateData = {
        name: 'Updated Product',
        price: 150
      }

      const response = await request(app)
        .put(`/api/products/${product.id}`)
        .send(updateData)
        .expect(200)

      expect(response.body.name).toBe('Updated Product')
      expect(response.body.price).toBe(150)
    })

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .put('/api/products/999')
        .send({ name: 'Updated' })
        .expect(404)
    })
  })

  describe('DELETE /api/products/:id', () => {
    it('should delete an existing product', async () => {
      const product = await Product.create({
        name: 'Product to Delete',
        price: 100,
        description: 'Will be deleted',
        category: '删除分类',
        brand: '删除品牌',
        image: 'delete-image.jpg'
      })

      await request(app)
        .delete(`/api/products/${product.id}`)
        .expect(200)

      // 验证产品已被删除
      const deletedProduct = await Product.findByPk(product.id)
      expect(deletedProduct).toBeNull()
    })

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .delete('/api/products/999')
        .expect(404)
    })
  })
}) 