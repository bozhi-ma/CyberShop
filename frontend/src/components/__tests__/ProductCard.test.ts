import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '../ProductCard.vue'

// Mock product data
const mockProduct = {
  id: 1,
  name: 'iPhone 15 Pro',
  price: 7999,
  originalPrice: 8999,
  discount: 11,
  rating: 4.8,
  reviews: 1250,
  sales: 5000,
  brand: 'Apple',
  category: '手机',
  image: 'https://images.unsplash.com/photo-xxx?w=400&h=400&fit=crop',
  isNew: true,
  isHot: false,
  description: '最新款iPhone，搭载A17 Pro芯片'
}

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    expect(wrapper.text()).toContain('iPhone 15 Pro')
    expect(wrapper.text()).toContain('¥7,999')
    expect(wrapper.text()).toContain('¥8,999')
    expect(wrapper.text()).toContain('11%')
    expect(wrapper.text()).toContain('4.8')
    expect(wrapper.text()).toContain('1,250')
  })

  it('shows new tag when product is new', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: { ...mockProduct, isNew: true }
      }
    })

    expect(wrapper.find('.new-tag').exists()).toBe(true)
  })

  it('shows hot tag when product is hot', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: { ...mockProduct, isHot: true }
      }
    })

    expect(wrapper.find('.hot-tag').exists()).toBe(true)
  })

  it('emits add-to-cart event when add to cart button is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('.add-to-cart-btn').trigger('click')
    
    expect(wrapper.emitted('add-to-cart')).toBeTruthy()
    expect(wrapper.emitted('add-to-cart')?.[0]).toEqual([mockProduct])
  })

  it('emits view-detail event when card is clicked', async () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct
      }
    })

    await wrapper.find('.product-card').trigger('click')
    
    expect(wrapper.emitted('view-detail')).toBeTruthy()
    expect(wrapper.emitted('view-detail')?.[0]).toEqual([mockProduct])
  })

  it('displays discount percentage correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: { ...mockProduct, discount: 25 }
      }
    })

    expect(wrapper.text()).toContain('25%')
  })

  it('handles missing image gracefully', () => {
    const productWithoutImage = { ...mockProduct, image: '' }
    const wrapper = mount(ProductCard, {
      props: {
        product: productWithoutImage
      }
    })

    expect(wrapper.find('.product-image').exists()).toBe(true)
  })
}) 