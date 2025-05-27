const admin = require('firebase-admin');
// ↓↓↓ 確保這裡的路徑指向你下載的服務帳號金鑰檔案 ↓↓↓
const serviceAccount = require('./serviceAccountKey.json');
// ↓↓↓ 確保這裡的路徑指向你創建的課程資料 JSON 檔案 ↓↓↓
const coursesData = require('./courses.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const coursesCollection = db.collection('courses'); // 確保這個集合名稱與你的 Firestore 一致

async function importCourses() {
  console.log(`Starting to import ${coursesData.length} courses...`);
  for (const course of coursesData) {
    try {
      // 使用 add() 會自動生成文檔 ID
      const docRef = await coursesCollection.add(course);
      console.log(`Successfully imported course: "${course.title}" with ID: ${docRef.id}`);
    } catch (error) {
      console.error(`Error importing course "${course.title || 'Untitled Course'}":`, error);
    }
  }
  console.log('Finished importing all courses.');
  process.exit(0); // 腳本執行完畢後正常退出
}

importCourses().catch(error => {
    console.error("Unhandled error during import:", error);
    process.exit(1); // 發生未處理錯誤時異常退出
});