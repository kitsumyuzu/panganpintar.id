"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyStore = exports.createStoreReview = exports.getItemCategories = exports.getStoreTypes = exports.updateStore = exports.updateStoreItem = exports.createStoreItem = exports.createStore = exports.getStoreReviews = exports.getAllItems = exports.getStoreItems = exports.getStoreBySlug = exports.getAllStores = void 0;
const db_1 = __importDefault(require("@/config/db"));
// Response helper
const sendResponse = (res, statusCode, data) => {
    return res.status(statusCode).json(data);
};
// Get all stores
const getAllStores = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { province, search, store_type } = req.query;
        let query = `
            SELECT 
                s._id,
                s.owner_id,
                s.name,
                s.slug,
                s.description,
                s.store_type_id,
                s.province,
                s.city,
                s.address,
                s.rating,
                s.review_count,
                s.image,
                s.is_verified,
                s.created_at,
                st.name as store_type_name,
                st.slug as store_type_slug
            FROM affiliate_stores s
            LEFT JOIN store_types st ON s.store_type_id = st._id
            WHERE s.is_active = 1
        `;
        const params = [];
        if (province && province !== 'Semua Provinsi') {
            query += ' AND s.province = ?';
            params.push(province);
        }
        if (search) {
            query += ' AND s.name LIKE ?';
            params.push(`%${search}%`);
        }
        if (store_type) {
            query += ' AND s.store_type_id = ?';
            params.push(parseInt(store_type));
        }
        query += ' ORDER BY s.rating DESC, s.review_count DESC';
        const [rows] = await connection.execute(query, params);
        // Transform to match frontend
        const transformedStores = rows.map((store) => ({
            id: store._id,
            name: store.name,
            slug: store.slug,
            description: store.description,
            province: store.province,
            city: store.city,
            address: store.address,
            rating: store.rating,
            review_count: store.review_count,
            image: store.image,
            is_verified: store.is_verified,
            created_at: store.created_at,
            store_type: {
                name: store.store_type_name,
                slug: store.store_type_slug
            }
        }));
        return sendResponse(res, 200, {
            success: true,
            data: transformedStores
        });
    }
    catch (error) {
        console.error('Get all stores error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengambil data store'
        });
    }
    finally {
        connection.release();
    }
};
exports.getAllStores = getAllStores;
// Get store by slug
const getStoreBySlug = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { slug } = req.params;
        const [rows] = await connection.execute(`
            SELECT 
                s.*,
                st.name as store_type_name,
                st.slug as store_type_slug
            FROM affiliate_stores s
            LEFT JOIN store_types st ON s.store_type_id = st._id
            WHERE s.slug = ? AND s.is_active = 1
        `, [slug]);
        const stores = rows;
        if (stores.length === 0) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Store tidak ditemukan'
            });
        }
        const store = stores[0];
        return sendResponse(res, 200, {
            success: true,
            data: {
                id: store._id,
                name: store.name,
                slug: store.slug,
                description: store.description,
                province: store.province,
                city: store.city,
                address: store.address,
                rating: store.rating,
                review_count: store.review_count,
                image: store.image,
                cover_image: store.cover_image,
                phone: store.phone,
                whatsapp: store.whatsapp,
                email: store.email,
                instagram: store.instagram,
                facebook: store.facebook,
                tiktok: store.tiktok,
                is_verified: store.is_verified,
                created_at: store.created_at,
                store_type: {
                    name: store.store_type_name,
                    slug: store.store_type_slug
                }
            }
        });
    }
    catch (error) {
        console.error('Get store by slug error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengambil data store'
        });
    }
    finally {
        connection.release();
    }
};
exports.getStoreBySlug = getStoreBySlug;
// Get store items by slug
const getStoreItems = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { slug } = req.params;
        const [rows] = await connection.execute(`
            SELECT 
                i._id,
                i.store_id,
                i.item_category_id,
                i.name,
                i.description,
                i.image,
                i.price,
                i.price_discounter,
                i.unit,
                i.min_order,
                i.is_featured,
                i.is_active,
                i.created_at,
                ic.name as item_category_name,
                ic.slug as item_category_slug,
                COALESCE(s.quantity, 0) as stock_quantity
            FROM store_items i
            LEFT JOIN item_categories ic ON i.item_category_id = ic._id
            LEFT JOIN item_stocks s ON i._id = s.item_id
            INNER JOIN affiliate_stores st ON i.store_id = st._id
            WHERE st.slug = ? AND i.is_active = 1
            ORDER BY i.is_featured DESC, i.name ASC
        `, [slug]);
        const items = rows;
        // Transform items with status and stock
        const transformedItems = items.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: item.price,
            price_discounter: item.price_discounter,
            unit: item.unit,
            min_order: item.min_order,
            is_featured: item.is_featured,
            status: (item.stock_quantity || 0) > 10
                ? 'stable'
                : (item.stock_quantity || 0) > 0
                    ? 'up'
                    : 'down',
            stock_quantity: item.stock_quantity || 0,
            stock: (item.stock_quantity || 0) > 10
                ? 'Tersedia'
                : (item.stock_quantity || 0) > 0
                    ? 'Limited'
                    : 'Tidak Tersedia',
            item_category: {
                name: item.item_category_name,
                slug: item.item_category_slug
            }
        }));
        return sendResponse(res, 200, {
            success: true,
            data: transformedItems
        });
    }
    catch (error) {
        console.error('Get store items error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengambil data item'
        });
    }
    finally {
        connection.release();
    }
};
exports.getStoreItems = getStoreItems;
// Get all active store items
const getAllItems = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT
                i._id,
                i.store_id,
                i.item_category_id,
                i.name,
                i.description,
                i.image,
                i.price,
                i.price_discounter,
                i.unit,
                i.min_order,
                i.is_featured,
                i.is_active,
                i.created_at,
                ic.name as item_category_name,
                ic.slug as item_category_slug,
                st.name as store_name,
                COALESCE(s.quantity, 0) as stock_quantity
            FROM store_items i
            LEFT JOIN item_categories ic ON i.item_category_id = ic._id
            LEFT JOIN item_stocks s ON i._id = s.item_id
            LEFT JOIN affiliate_stores st ON i.store_id = st._id
            WHERE i.is_active = 1 AND st.is_active = 1
            ORDER BY i.is_featured DESC, i.name ASC
        `);
        const items = rows;
        const transformedItems = items.map((item) => ({
            id: item._id,
            name: item.name,
            description: item.description,
            image: item.image,
            price: parseFloat(item.price) || 0,
            price_discounter: item.price_discounter,
            unit: item.unit,
            min_order: item.min_order,
            is_featured: item.is_featured,
            store: item.store_name,
            storeId: item.store_id,
            status: (item.stock_quantity || 0) > 10
                ? 'stable'
                : (item.stock_quantity || 0) > 0
                    ? 'up'
                    : 'down',
            stock_quantity: item.stock_quantity || 0,
            stock: (item.stock_quantity || 0) > 10
                ? 'Tersedia'
                : (item.stock_quantity || 0) > 0
                    ? 'Limited'
                    : 'Tidak Tersedia',
            item_category: {
                name: item.item_category_name,
                slug: item.item_category_slug
            }
        }));
        return sendResponse(res, 200, {
            success: true,
            data: transformedItems
        });
    }
    catch (error) {
        console.error('Get all items error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengambil data item'
        });
    }
    finally {
        connection.release();
    }
};
exports.getAllItems = getAllItems;
// Get store reviews by slug
const getStoreReviews = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const { slug } = req.params;
        const [storeRows] = await connection.execute('SELECT _id FROM affiliate_stores WHERE slug = ? AND is_active = 1', [slug]);
        const stores = storeRows;
        if (stores.length === 0) {
            return sendResponse(res, 404, {
                success: false,
                error: 'Store tidak ditemukan'
            });
        }
        const storeId = stores[0]._id;
        const [rows] = await connection.execute(`
            SELECT
                r._id,
                r.rating,
                r.review_text,
                r.created_at,
                u.username,
                u.email
            FROM store_reviews r
            JOIN users u ON r.user_id = u._id
            WHERE r.store_id = ? AND r.is_active = 1
            ORDER BY r.created_at DESC
        `, [storeId]);
        return sendResponse(res, 200, {
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Get store reviews error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengambil data review'
        });
    }
    finally {
        connection.release();
    }
};
exports.getStoreReviews = getStoreReviews;
// Create new store
const createStore = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const userId = req.user?.id;
        if (!userId) {
            await connection.rollback();
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const { name, description, store_type_id, province, city, address, phone, whatsapp, email, instagram, facebook, tiktok } = req.body;
        const files = req.files;
        const imageFile = files?.image?.[0];
        const coverImageFile = files?.cover_image?.[0];
        const image = imageFile ? `/uploads/${imageFile.filename}` : req.body.image;
        const cover_image = coverImageFile ? `/uploads/${coverImageFile.filename}` : req.body.cover_image;
        if (!name || !store_type_id || !province) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Nama, tipe store, dan province wajib diisi'
            });
        }
        const baseSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const slug = `${baseSlug}-${Date.now()}`;
        const [result] = await connection.execute(`
            INSERT INTO affiliate_stores 
            (owner_id, name, slug, description, store_type_id, province, city, address, image, cover_image, phone, whatsapp, email, instagram, facebook, tiktok)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            name,
            slug,
            description || null,
            store_type_id,
            province,
            city || null,
            address || null,
            image || null,
            cover_image || null,
            phone || null,
            whatsapp || null,
            email || null,
            instagram || null,
            facebook || null,
            tiktok || null
        ]);
        await connection.commit();
        return sendResponse(res, 201, {
            success: true,
            message: 'Store berhasil dibuat',
            data: { slug }
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Create store error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat membuat store'
        });
    }
    finally {
        connection.release();
    }
};
exports.createStore = createStore;
// Add item to store
const createStoreItem = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const userId = req.user?.id;
        if (!userId) {
            await connection.rollback();
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const { storeId } = req.params;
        const { item_category_id, name, description, price, unit } = req.body;
        // Verify store ownership
        const [rows] = await connection.execute('SELECT _id FROM affiliate_stores WHERE _id = ? AND owner_id = ?', [storeId, userId]);
        const stores = rows;
        if (stores.length === 0) {
            await connection.rollback();
            return sendResponse(res, 403, {
                success: false,
                error: 'Store tidak ditemukan atau bukan milik Anda'
            });
        }
        const itemCategoryId = Number(item_category_id);
        const priceValue = Number(price);
        if (!itemCategoryId || !name || !priceValue || priceValue <= 0) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Kategori item, nama, dan harga wajib diisi'
            });
        }
        // Get image from file upload if exists
        const image = req.file ? `/uploads/${req.file.filename}` : null;
        const [result] = await connection.execute(`
            INSERT INTO store_items 
            (store_id, item_category_id, name, description, image, price, unit)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            storeId,
            itemCategoryId,
            name,
            description || null,
            image,
            priceValue,
            unit || '/kg'
        ]);
        const itemId = result.insertId;
        await connection.execute(`
            INSERT INTO item_stocks (item_id, quantity) VALUES (?, ?)
        `, [itemId, 0]);
        await connection.commit();
        return sendResponse(res, 201, {
            success: true,
            message: 'Item berhasil ditambahkan'
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Create item error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat menambahkan item'
        });
    }
    finally {
        connection.release();
    }
};
exports.createStoreItem = createStoreItem;
// Update store item and stock
const updateStoreItem = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const userId = req.user?.id;
        const { storeId, itemId } = req.params;
        const { name, description, price, price_discounter, unit, min_order, stock_quantity } = req.body;
        if (!userId) {
            await connection.rollback();
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const [rows] = await connection.execute(`SELECT i._id FROM store_items i
             INNER JOIN affiliate_stores s ON i.store_id = s._id
             WHERE i._id = ? AND s._id = ? AND s.owner_id = ?`, [itemId, storeId, userId]);
        const items = rows;
        if (items.length === 0) {
            await connection.rollback();
            return sendResponse(res, 403, {
                success: false,
                error: 'Item tidak ditemukan atau bukan milik Anda'
            });
        }
        const fields = [];
        const params = [];
        if (name) {
            fields.push('name = ?');
            params.push(name);
        }
        if (description !== undefined) {
            fields.push('description = ?');
            params.push(description || null);
        }
        if (price !== undefined) {
            const priceValue = Number(price);
            if (Number.isNaN(priceValue) || priceValue <= 0) {
                await connection.rollback();
                return sendResponse(res, 400, {
                    success: false,
                    error: 'Harga harus berupa angka positif'
                });
            }
            fields.push('price = ?');
            params.push(priceValue);
        }
        if (price_discounter !== undefined) {
            const discountValue = price_discounter ? Number(price_discounter) : null;
            fields.push('price_discounter = ?');
            params.push(discountValue);
        }
        if (unit !== undefined) {
            fields.push('unit = ?');
            params.push(unit);
        }
        if (min_order !== undefined) {
            const minOrderValue = Number(min_order);
            if (Number.isNaN(minOrderValue) || minOrderValue < 1) {
                await connection.rollback();
                return sendResponse(res, 400, {
                    success: false,
                    error: 'Minimal pesanan harus minimal 1'
                });
            }
            fields.push('min_order = ?');
            params.push(minOrderValue);
        }
        if (fields.length > 0) {
            params.push(itemId);
            await connection.execute(`UPDATE store_items SET ${fields.join(', ')} WHERE _id = ?`, params);
        }
        if (stock_quantity !== undefined) {
            const quantityValue = Number(stock_quantity);
            if (Number.isNaN(quantityValue) || quantityValue < 0) {
                await connection.rollback();
                return sendResponse(res, 400, {
                    success: false,
                    error: 'Jumlah stok harus berupa angka nol atau positif'
                });
            }
            await connection.execute(`INSERT INTO item_stocks (item_id, quantity)
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`, [itemId, quantityValue]);
        }
        await connection.commit();
        return sendResponse(res, 200, {
            success: true,
            message: 'Item berhasil diperbarui'
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Update store item error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat memperbarui item'
        });
    }
    finally {
        connection.release();
    }
};
exports.updateStoreItem = updateStoreItem;
// Update affiliate store info
const updateStore = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const userId = req.user?.id;
        const { storeId } = req.params;
        const files = req.files;
        const imageFile = files?.image?.[0];
        const coverImageFile = files?.cover_image?.[0];
        const image = imageFile ? `/uploads/${imageFile.filename}` : undefined;
        const cover_image = coverImageFile ? `/uploads/${coverImageFile.filename}` : undefined;
        const { name, description, province, city, address, phone, whatsapp, email, instagram, facebook, tiktok } = req.body;
        if (!userId) {
            await connection.rollback();
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const [storeRows] = await connection.execute('SELECT _id FROM affiliate_stores WHERE _id = ? AND owner_id = ?', [storeId, userId]);
        const stores = storeRows;
        if (stores.length === 0) {
            await connection.rollback();
            return sendResponse(res, 403, {
                success: false,
                error: 'Store tidak ditemukan atau bukan milik Anda'
            });
        }
        const fields = [];
        const params = [];
        if (name !== undefined) {
            fields.push('name = ?');
            params.push(name);
        }
        if (description !== undefined) {
            fields.push('description = ?');
            params.push(description || null);
        }
        if (province !== undefined) {
            fields.push('province = ?');
            params.push(province);
        }
        if (city !== undefined) {
            fields.push('city = ?');
            params.push(city || null);
        }
        if (address !== undefined) {
            fields.push('address = ?');
            params.push(address || null);
        }
        if (phone !== undefined) {
            fields.push('phone = ?');
            params.push(phone || null);
        }
        if (whatsapp !== undefined) {
            fields.push('whatsapp = ?');
            params.push(whatsapp || null);
        }
        if (email !== undefined) {
            fields.push('email = ?');
            params.push(email || null);
        }
        if (instagram !== undefined) {
            fields.push('instagram = ?');
            params.push(instagram || null);
        }
        if (facebook !== undefined) {
            fields.push('facebook = ?');
            params.push(facebook || null);
        }
        if (tiktok !== undefined) {
            fields.push('tiktok = ?');
            params.push(tiktok || null);
        }
        if (image !== undefined) {
            fields.push('image = ?');
            params.push(image);
        }
        if (cover_image !== undefined) {
            fields.push('cover_image = ?');
            params.push(cover_image);
        }
        if (fields.length === 0) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Tidak ada data yang diperbarui'
            });
        }
        params.push(storeId);
        await connection.execute(`UPDATE affiliate_stores SET ${fields.join(', ')} WHERE _id = ?`, params);
        await connection.commit();
        return sendResponse(res, 200, {
            success: true,
            message: 'Store berhasil diperbarui'
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Update store error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat memperbarui store'
        });
    }
    finally {
        connection.release();
    }
};
exports.updateStore = updateStore;
// Get store types
const getStoreTypes = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT _id, name, slug, icon, description 
            FROM store_types 
            ORDER BY name ASC
        `);
        return sendResponse(res, 200, {
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Get store types error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.getStoreTypes = getStoreTypes;
// Get item categories
const getItemCategories = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const [rows] = await connection.execute(`
            SELECT _id, name, slug, icon, description 
            FROM item_categories 
            ORDER BY name ASC
        `);
        return sendResponse(res, 200, {
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Get item categories error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.getItemCategories = getItemCategories;
// Create review for store
const createStoreReview = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const userId = req.user?.id;
        if (!userId) {
            await connection.rollback();
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const { slug } = req.params;
        const { rating, review_text } = req.body;
        const ratingValue = Number(rating);
        if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
            await connection.rollback();
            return sendResponse(res, 400, {
                success: false,
                error: 'Rating harus antara 1 sampai 5'
            });
        }
        const [storeRows] = await connection.execute('SELECT _id, owner_id FROM affiliate_stores WHERE slug = ? AND is_active = 1', [slug]);
        const stores = storeRows;
        if (stores.length === 0) {
            await connection.rollback();
            return sendResponse(res, 404, {
                success: false,
                error: 'Store tidak ditemukan'
            });
        }
        const storeId = stores[0]._id;
        const storeOwnerId = stores[0].owner_id;
        if (storeOwnerId === userId) {
            await connection.rollback();
            return sendResponse(res, 403, {
                success: false,
                error: 'Anda tidak dapat memberi ulasan pada toko Anda sendiri'
            });
        }
        const [existingRows] = await connection.execute('SELECT _id FROM store_reviews WHERE store_id = ? AND user_id = ? AND is_active = 1', [storeId, userId]);
        const existingReviews = existingRows;
        if (existingReviews.length > 0) {
            const reviewId = existingReviews[0]._id;
            await connection.execute('UPDATE store_reviews SET rating = ?, review_text = ?, updated_at = CURRENT_TIMESTAMP WHERE _id = ?', [ratingValue, review_text || null, reviewId]);
        }
        else {
            await connection.execute('INSERT INTO store_reviews (store_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)', [storeId, userId, ratingValue, review_text || null]);
        }
        const [aggregateRows] = await connection.execute('SELECT COUNT(*) as count, AVG(rating) as avgRating FROM store_reviews WHERE store_id = ? AND is_active = 1', [storeId]);
        const agg = aggregateRows[0];
        const reviewCount = Number(agg.count || 0);
        const averageRating = Number(agg.avgRating || 0).toFixed(2);
        await connection.execute('UPDATE affiliate_stores SET rating = ?, review_count = ? WHERE _id = ?', [averageRating, reviewCount, storeId]);
        await connection.commit();
        return sendResponse(res, 201, {
            success: true,
            message: 'Review berhasil dikirim',
            data: {
                rating: Number(averageRating),
                review_count: reviewCount
            }
        });
    }
    catch (error) {
        await connection.rollback();
        console.error('Create store review error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan saat mengirim review'
        });
    }
    finally {
        connection.release();
    }
};
exports.createStoreReview = createStoreReview;
// Get current user's store
const getMyStore = async (req, res) => {
    const connection = await db_1.default.getConnection();
    try {
        const userId = req.user?.id;
        if (!userId) {
            return sendResponse(res, 401, {
                success: false,
                error: 'Unauthorized'
            });
        }
        const [rows] = await connection.execute(`
            SELECT 
                s._id,
                s.name,
                s.slug,
                s.description,
                s.province,
                s.city,
                s.address,
                s.rating,
                s.review_count,
                s.image,
                s.is_verified,
                s.is_active,
                s.created_at,
                st.name as store_type_name
            FROM affiliate_stores s
            LEFT JOIN store_types st ON s.store_type_id = st._id
            WHERE s.owner_id = ?
        `, [userId]);
        const stores = rows;
        if (stores.length === 0) {
            return sendResponse(res, 200, {
                success: true,
                data: null
            });
        }
        const store = stores[0];
        return sendResponse(res, 200, {
            success: true,
            data: {
                id: store._id,
                name: store.name,
                slug: store.slug,
                description: store.description,
                province: store.province,
                city: store.city,
                address: store.address,
                rating: store.rating,
                review_count: store.review_count,
                image: store.image,
                is_verified: store.is_verified,
                is_active: store.is_active,
                store_type: {
                    name: store.store_type_name
                }
            }
        });
    }
    catch (error) {
        console.error('Get my store error:', error);
        return sendResponse(res, 500, {
            success: false,
            error: 'Terjadi kesalahan'
        });
    }
    finally {
        connection.release();
    }
};
exports.getMyStore = getMyStore;
