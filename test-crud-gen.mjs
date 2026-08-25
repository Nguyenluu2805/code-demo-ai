function generateCrudApiDemo(language, prompt, theme, aspectRatio) {
  const isPython = language === 'python' || prompt.toLowerCase().includes('python') || prompt.toLowerCase().includes('fastapi');
  
  if (isPython) {
    return {
      title: 'RESTful CRUD API với Python FastAPI',
      description: 'Xây dựng trọn bộ API quản lý sản phẩm: Thêm, Đọc, Sửa, Xóa với Pydantic & FastAPI',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-py-1',
          type: 'editor',
          title: 'Khởi tạo FastAPI App & Pydantic Model',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

# Database bộ nhớ tạm (In-memory Storage)
products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]`,
          startTypingFromLine: 1,
          highlightLines: [5, 7, 8, 9, 10, 14],
          zoomScale: 1.08,
          focusLine: 7,
          speakerScript: "Chào mừng các bạn đến với bài xây dựng RESTful CRUD API với FastAPI. Đầu tiên, chúng ta import FastAPI, HTTPException và Pydantic BaseModel. Khởi tạo đối tượng app và định nghĩa schema Product gồm các trường id, name, price và stock. Sau đó, ta thiết lập danh sách products_db mẫu để lưu trữ dữ liệu trong bộ nhớ.",
          durationInFrames: 330
        },
        {
          id: 'crud-py-2',
          type: 'editor',
          title: 'Tạo Endpoint Đọc (GET) và Thêm Mới (POST)',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]

@app.get("/api/products", response_model=List[Product])
def get_all_products():
    """Lấy danh sách tất cả sản phẩm"""
    return products_db

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: Product):
    """Thêm một sản phẩm mới vào hệ thống"""
    for p in products_db:
        if p.id == product.id:
            raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại!")
    products_db.append(product)
    return product`,
          startTypingFromLine: 19,
          highlightLines: [19, 21, 24, 28, 29],
          zoomScale: 1.08,
          focusLine: 24,
          speakerScript: "Tiếp theo, chúng ta định nghĩa 2 endpoint đầu tiên: GET /api/products để đọc toàn bộ danh sách sản phẩm, và POST /api/products với mã HTTP 201 Created để thêm sản phẩm mới. Trong hàm create_product, ta kiểm tra trùng lặp id trước khi append vào danh sách và trả về đối tượng vừa tạo.",
          durationInFrames: 360
        },
        {
          id: 'crud-py-3',
          type: 'editor',
          title: 'Tạo Endpoint Sửa (PUT) và Xóa (DELETE)',
          filename: 'main.py',
          language: 'python',
          code: `from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Product Management API")

class Product(BaseModel):
    id: int
    name: str
    price: float
    stock: int = 10

products_db: List[Product] = [
    Product(id=1, name="Bàn phím cơ Mechanical", price=89.9, stock=15),
    Product(id=2, name="Chuột không dây Silent", price=35.0, stock=20)
]

@app.get("/api/products", response_model=List[Product])
def get_all_products():
    return products_db

@app.post("/api/products", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(product: Product):
    for p in products_db:
        if p.id == product.id:
            raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại!")
    products_db.append(product)
    return product

@app.put("/api/products/{product_id}", response_model=Product)
def update_product(product_id: int, updated: Product):
    """Cập nhật thông tin sản phẩm theo ID"""
    for idx, p in enumerate(products_db):
        if p.id == product_id:
            products_db[idx] = updated
            return updated
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int):
    """Xóa sản phẩm khỏi hệ thống theo ID"""
    for idx, p in enumerate(products_db):
        if p.id == product_id:
            deleted = products_db.pop(idx)
            return {"message": f"Đã xóa thành công sản phẩm: {deleted.name}"}
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm!")`,
          startTypingFromLine: 31,
          highlightLines: [31, 35, 37, 39, 43, 44],
          zoomScale: 1.08,
          focusLine: 35,
          speakerScript: "Để hoàn thiện tính năng CRUD, chúng ta viết endpoint PUT /api/products/{product_id} cập nhật thông tin sản phẩm và endpoint DELETE để xóa phần tử bằng phương thức pop(). Cả hai đều có cơ chế bắt lỗi 404 Not Found nếu không tìm thấy ID yêu cầu.",
          durationInFrames: 380
        },
        {
          id: 'crud-py-term',
          type: 'terminal',
          title: 'Kiểm thử toàn diện CRUD trên Terminal',
          command: 'pytest test_api.py -v',
          output: `test_api.py::test_get_all_products PASSED             [ 25%] -> 200 OK (2 items)
test_api.py::test_create_product PASSED               [ 50%] -> 201 Created (id: 3)
test_api.py::test_update_product_price PASSED         [ 75%] -> 200 OK (price: 99.9)
test_api.py::test_delete_product PASSED               [100%] -> 200 OK (Deleted)

======================== 4 passed in 0.42s ========================
[SUCCESS] Toàn bộ 4 chức năng CRUD (GET, POST, PUT, DELETE) hoạt động hoàn hảo!`,
          speakerScript: "Chạy bộ kiểm thử tự động với PyTest. Toàn bộ 4 chức năng CRUD gồm lấy danh sách, thêm sản phẩm mới, cập nhật giá và xóa sản phẩm đều phản hồi mã HTTP chuẩn xác 100%!",
          durationInFrames: 240
        }
      ]
    };
  } else {
    // Node.js Express Implementation
    return {
      title: 'RESTful CRUD API với Node.js & Express',
      description: 'Xây dựng trọn bộ REST API quản lý sản phẩm/người dùng: Thêm, Đọc, Sửa, Xóa',
      aspectRatio,
      theme,
      fps: 30,
      scenes: [
        {
          id: 'crud-node-1',
          type: 'editor',
          title: 'Khởi tạo Express Server & Mock Database',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

// In-memory Database sản phẩm
let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];`,
          startTypingFromLine: 1,
          highlightLines: [1, 2, 3, 6, 7, 8],
          zoomScale: 1.08,
          focusLine: 6,
          speakerScript: "Chào các bạn, hôm nay chúng ta sẽ cùng xây dựng trọn bộ RESTful API CRUD với Node.js và Express. Đầu tiên, chúng ta nạp thư viện express, bật middleware express.json để phân tích body dạng JSON, và khởi tạo mảng products lưu trữ dữ liệu sản phẩm trong bộ nhớ.",
          durationInFrames: 300
        },
        {
          id: 'crud-node-2',
          type: 'editor',
          title: 'Viết Route Đọc (GET) và Thêm Mới (POST)',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];

// 1. GET - Đọc danh sách sản phẩm
app.get('/api/products', (req, res) => {
  res.status(200).json({ success: true, data: products });
});

// 2. POST - Thêm mới sản phẩm
app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Tên và giá sản phẩm là bắt buộc!' });
  }
  const newProduct = { id: Date.now(), name, price: Number(price), inStock: true };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});`,
          startTypingFromLine: 11,
          highlightLines: [12, 13, 17, 22, 23, 24],
          zoomScale: 1.08,
          focusLine: 17,
          speakerScript: "Tiếp theo, ta viết 2 route chính: GET /api/products trả về toàn bộ danh sách với mã 200, và POST /api/products để tạo sản phẩm mới. Trong route POST, ta kiểm tra tính hợp lệ của dữ liệu đầu vào, gán id duy nhất bằng Date.now(), push vào mảng và phản hồi mã 201 Created.",
          durationInFrames: 360
        },
        {
          id: 'crud-node-3',
          type: 'editor',
          title: 'Viết Route Cập Nhật (PUT) và Xóa (DELETE)',
          filename: 'server.js',
          language: 'javascript',
          code: `const express = require('express');
const app = express();
app.use(express.json());

let products = [
  { id: 1, name: 'Bàn phím cơ RGB', price: 120, inStock: true },
  { id: 2, name: 'Màn hình 4K IPS', price: 450, inStock: true }
];

app.get('/api/products', (req, res) => {
  res.status(200).json({ success: true, data: products });
});

app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: Date.now(), name, price: Number(price), inStock: true };
  products.push(newProduct);
  res.status(201).json({ success: true, data: newProduct });
});

// 3. PUT - Cập nhật thông tin theo ID
app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
  products[index] = { ...products[index], ...req.body };
  res.status(200).json({ success: true, data: products[index] });
});

// 4. DELETE - Xóa sản phẩm theo ID
app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);
  if (products.length === initialLength) return res.status(404).json({ error: 'Không tìm thấy sản phẩm!' });
  res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công!' });
});

app.listen(5000, () => console.log('Server chạy tại port 5000'));`,
          startTypingFromLine: 24,
          highlightLines: [25, 27, 29, 34, 36, 40],
          zoomScale: 1.08,
          focusLine: 25,
          speakerScript: "Để hoàn thiện hệ thống, ta cài đặt route PUT cập nhật thuộc tính sản phẩm dựa trên ID bằng toán tử spread, và route DELETE lọc bỏ phần tử khỏi mảng với filter(). Cuối cùng, hàm app.listen khởi động máy chủ tại cổng 5000 sẵn sàng nhận request.",
          durationInFrames: 380
        },
        {
          id: 'crud-node-term',
          type: 'terminal',
          title: 'Thử nghiệm gọi CRUD API qua cURL',
          command: 'curl -X POST http://localhost:5000/api/products -d \'{"name":"Tai nghe Sony","price":299}\' -H "Content-Type: application/json"',
          output: `HTTP/1.1 201 Created
{ "success": true, "data": { "id": 1724589201, "name": "Tai nghe Sony", "price": 299, "inStock": true } }

>> curl -X GET http://localhost:5000/api/products
HTTP/1.1 200 OK -> Đã lấy 3 sản phẩm thành công!

>> curl -X DELETE http://localhost:5000/api/products/1
HTTP/1.1 200 OK -> "Đã xóa sản phẩm thành công!"
[SUCCESS] Hệ thống RESTful API CRUD hoàn thành 100%!`,
          speakerScript: "Thử nghiệm gửi các request POST, GET và DELETE tới server. Toàn bộ các phản hồi JSON đều trả về mã trạng thái HTTP chuẩn xác 201 Created và 200 OK!",
          durationInFrames: 240
        }
      ]
    };
  }
}

console.log("Generated CRUD Python demo title:", generateCrudApiDemo('python', 'CRUD API FastAPI', 'one-dark', '16:9').title);
console.log("Generated CRUD Node demo title:", generateCrudApiDemo('javascript', 'RESTful API CRUD Express', 'one-dark', '16:9').title);
