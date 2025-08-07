import { put, list } from '@vercel/blob';

async function testBlobStorage() {
  console.log('🧪 Testing Vercel Blob storage...');
  
  try {
    // Test 1: List existing blobs
    console.log('\n1️⃣ Listing existing blobs...');
    const { blobs } = await list();
    console.log(`✅ Found ${blobs.length} existing blobs`);
    
    // Test 2: Upload a test file
    console.log('\n2️⃣ Testing file upload...');
    const testContent = 'Hello from Ymir Sailing Club!';
    const testBlob = await put('test/hello.txt', testContent, {
      access: 'public',
      addRandomSuffix: false
    });
    console.log(`✅ Uploaded test file: ${testBlob.url}`);
    
    // Test 3: List blobs again
    console.log('\n3️⃣ Listing blobs after upload...');
    const { blobs: updatedBlobs } = await list();
    console.log(`✅ Now have ${updatedBlobs.length} blobs`);
    
    console.log('\n🎉 Vercel Blob storage test passed!');
    
  } catch (error) {
    console.error('❌ Blob storage test failed:', error);
    throw error;
  }
}

// Run test if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testBlobStorage().catch(console.error);
}

export { testBlobStorage }; 