import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import PageLoader from './components/common/PageLoader'
import ScrollToTop from './components/common/ScrollToTop'

const Home          = lazy(() => import('./pages/Home'))
const Shop          = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart          = lazy(() => import('./pages/Cart'))
const Checkout      = lazy(() => import('./pages/Checkout'))
const OrderSuccess  = lazy(() => import('./pages/OrderSuccess'))
const Account       = lazy(() => import('./pages/Account'))
const Login         = lazy(() => import('./pages/Login'))
const Register      = lazy(() => import('./pages/Register'))
const BlogListing   = lazy(() => import('./pages/BlogListing'))
const BlogPost      = lazy(() => import('./pages/BlogPost'))
const About         = lazy(() => import('./pages/About'))
const Contact       = lazy(() => import('./pages/Contact'))
const Search        = lazy(() => import('./pages/Search'))
const SkinQuiz      = lazy(() => import('./pages/SkinQuiz'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const Terms         = lazy(() => import('./pages/Terms'))
const NotFound      = lazy(() => import('./pages/NotFound'))

const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard     = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const AddProduct    = lazy(() => import('./pages/admin/AddProduct'))
const EditProduct   = lazy(() => import('./pages/admin/EditProduct'))
const AdminOrders   = lazy(() => import('./pages/admin/Orders'))
const OrderDetail   = lazy(() => import('./pages/admin/OrderDetail'))
const AdminBlogs    = lazy(() => import('./pages/admin/Blogs'))
const AddBlog       = lazy(() => import('./pages/admin/AddBlog'))
const EditBlog      = lazy(() => import('./pages/admin/EditBlog'))
const AdminCategories = lazy(() => import('./pages/admin/Categories'))
const AdminCoupons  = lazy(() => import('./pages/admin/Coupons'))
const AdminBanners  = lazy(() => import('./pages/admin/Banners'))
const AdminCustomers= lazy(() => import('./pages/admin/Customers'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/:slug" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="blog" element={<BlogListing />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="search" element={<Search />} />
            <Route path="skin-quiz" element={<SkinQuiz />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<Terms />} />
            <Route element={<ProtectedRoute />}>
              <Route path="account" element={<Account />} />
            </Route>
          </Route>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products"       element={<AdminProducts />} />
            <Route path="products/new"   element={<AddProduct />} />
            <Route path="products/:id"   element={<EditProduct />} />
            <Route path="orders"         element={<AdminOrders />} />
            <Route path="orders/:id"     element={<OrderDetail />} />
            <Route path="blogs"          element={<AdminBlogs />} />
            <Route path="blogs/new"      element={<AddBlog />} />
            <Route path="blogs/:id"      element={<EditBlog />} />
            <Route path="categories"     element={<AdminCategories />} />
            <Route path="coupons"        element={<AdminCoupons />} />
            <Route path="banners"        element={<AdminBanners />} />
            <Route path="customers"      element={<AdminCustomers />} />
            <Route path="settings"       element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
