```diff 
# דו'ח עבודה
```                                                                                 
  
```diff 
- 04/04/24 (חביאר) , מצב: בטיפול
גרידה קובץ מאזן ציונים של סטודנט ממוסד אקדמאי ספיר . (הערה : חסר טיפול ב- anti captcha + להריץ את השגרה בסרבר)
``` 
```diff 
+ 09/04/24 (חביאר) , מצב: סיום
חילוץ מידע מקובץ הציונים (PDF) הכולל פרטי הסטונדט : שם מלא , ת"ז , כתובת , שנת לימודים , רמת אנגלית , מחלקה , סטטוס , שנת לימודים. פרטים הודות קורסים : שם הקורס , ציון/מצב קיים. אובייקט Json לדוגמא:
``` 
```json
{
  "studentInfo": {
    "id": "302280383",
    "name": "גיברג חביאר",
    "address": "24/13 מקור חיים באר שבע 6712345",
    "phone": "0547331429",
    "email": "Jango117@mail.sapir.ac.il",
    "major": "ג",
    "status": "מן המנין",
    "degree": "B.Sc",
    "english": "פטור"
  },
  "courses": [
    {
      "course": "מבוא למדעי המחשב",
      "grade": "96"
    }
  
  ]
}

