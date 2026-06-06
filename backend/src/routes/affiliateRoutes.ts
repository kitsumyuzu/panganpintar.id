import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { 
    getAllStores, 
    getStoreBySlug, 
    getStoreItems,
    getAllItems,
    createStore, 
    createStoreItem,
    updateStore,
    updateStoreItem,
    getStoreReviews,
    createStoreReview,
    getStoreTypes,
    getItemCategories,
    getMyStore
} from '@/controllers/affiliateController'
import { authenticate } from '@/middleware/auth'

const upload = multer({
    storage: multer.diskStorage({
        destination: path.join(__dirname, '../../public/uploads'),
        filename: (_req, file, cb) => {
            const timestamp = Date.now()
            const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')
            cb(null, `${timestamp}-${safeName}`)
        }
    })
})

const router = Router()

/**
 * @swagger
 * /api/affiliate/stores:
 *   get:
 *     summary: Get all affiliate stores
 *     tags: [Affiliate]
 *     parameters:
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/stores', getAllStores)

/**
 * @swagger
 * /api/affiliate/items:
 *   get:
 *     summary: Get all affiliate store items
 *     tags: [Affiliate]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/items', getAllItems)

/**
 * @swagger
 * /api/affiliate/stores/{slug}:
 *   get:
 *     summary: Get store by slug
 *     tags: [Affiliate]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 */
router.get('/stores/:slug', getStoreBySlug)

/**
 * @swagger
 * /api/affiliate/stores/{slug}/items:
 *   get:
 *     summary: Get store items
 *     tags: [Affiliate]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/stores/:slug/items', getStoreItems)

/**
 * @swagger
 * /api/affiliate/stores/{slug}/reviews:
 *   get:
 *     summary: Get reviews for a store
 *     tags: [Affiliate]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/stores/:slug/reviews', getStoreReviews)

/**
 * @swagger
 * /api/affiliate/stores/{slug}/reviews:
 *   post:
 *     summary: Submit or update a review for a store
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review_text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/stores/:slug/reviews', authenticate, createStoreReview)

/**
 * @swagger
 * /api/affiliate/store-types:
 *   get:
 *     summary: Get all store types
 *     tags: [Affiliate]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/store-types', getStoreTypes)

/**
 * @swagger
 * /api/affiliate/item-categories:
 *   get:
 *     summary: Get all item categories
 *     tags: [Affiliate]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/item-categories', getItemCategories)

/**
 * @swagger
 * /api/affiliate/stores:
 *   post:
 *     summary: Create new store
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - store_type_id
 *               - province
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               store_type_id:
 *                 type: integer
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               cover_image:
 *                 type: string
 *                 format: binary
 *               phone:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               email:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               tiktok:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       401:
 *         description: Unauthorized
 */
router.post('/stores', authenticate, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
]), createStore)

/**
 * @swagger
 * /api/affiliate/stores/{storeId}/items:
 *   post:
 *     summary: Add item to store
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/stores/:storeId/items', authenticate, upload.single('image'), createStoreItem)

/**
 * @swagger
 * /api/affiliate/stores/{storeId}:
 *   patch:
 *     summary: Update affiliate store
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               province:
 *                 type: string
 *               city:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               whatsapp:
 *                 type: string
 *               email:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               tiktok:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/stores/:storeId', authenticate, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 }
]), updateStore)

/**
 * @swagger
 * /api/affiliate/stores/{storeId}/items/{itemId}:
 *   patch:
 *     summary: Update store item
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *               price_discounter:
 *                 type: number
 *               unit:
 *                 type: string
 *               min_order:
 *                 type: integer
 *               stock_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/stores/:storeId/items/:itemId', authenticate, updateStoreItem)

/**
 * @swagger
 * /api/affiliate/my-store:
 *   get:
 *     summary: Get current user's store
 *     tags: [Affiliate]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get('/my-store', authenticate, getMyStore)

export default router