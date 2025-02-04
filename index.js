document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // ป้องกันการโหลดหน้าใหม่
    let searchQuery = document.getElementById("searchBox").value.trim(); // ดึงค่าที่พิมพ์ในช่องค้นหา

    if (searchQuery !== "") {
        alert("คุณกำลังค้นหา: " + searchQuery); // แสดงผลที่พิมพ์ (สามารถเปลี่ยนให้ค้นหาจริงได้)
        
        // 🔹 เปลี่ยนไปที่หน้าผลลัพธ์ (เช่น ค้นหาสินค้า)
        window.location.href = "search.html?q=" + encodeURIComponent(searchQuery);
    } else {
        alert("กรุณาพิมพ์สิ่งที่ต้องการค้นหา!");
    }
});
