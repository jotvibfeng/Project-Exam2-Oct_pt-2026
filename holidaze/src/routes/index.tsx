import { createFileRoute } from '@tanstack/react-router'

import SearchBar from '#/components/searchBar'
import { ProductList } from '#/components/productList'

export const Route = createFileRoute('/')({ component: App })



function App() {


  return (
    <div>
      <SearchBar />
      <ProductList />
    </div>
  )
}
