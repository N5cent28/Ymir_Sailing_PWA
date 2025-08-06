# QR Code Generation Guide

## New Boats Added

The following boats have been added to the system:

### Individual Boats (one user at a time)
- Zest 4 (boat-6)
- Zest 5 (boat-7) 
- Zest 6 (boat-8)
- Topaz 1 (boat-9)
- Topaz 2 (boat-10)
- Laser 1 (boat-11)
- Laser 2 (boat-12)
- Laser 3 (boat-13)
- Laser 4 (boat-14)

### Shared Boats (multiple users can use simultaneously)
- Kayak (kayak)
- Paddle Board (paddle-board)

## QR Code URLs

Generate QR codes for the following URLs:

### Individual Boats
```
https://yourdomain.com/qr/boat-6    (Zest 4)
https://yourdomain.com/qr/boat-7    (Zest 5)
https://yourdomain.com/qr/boat-8    (Zest 6)
https://yourdomain.com/qr/boat-9    (Topaz 1)
https://yourdomain.com/qr/boat-10   (Topaz 2)
https://yourdomain.com/qr/boat-11   (Laser 1)
https://yourdomain.com/qr/boat-12   (Laser 2)
https://yourdomain.com/qr/boat-13   (Laser 3)
https://yourdomain.com/qr/boat-14   (Laser 4)
```

### Shared Boats
```
https://yourdomain.com/qr/kayak         (Kayak)
https://yourdomain.com/qr/paddle-board  (Paddle Board)
```

## How to Generate QR Codes

1. **Online QR Code Generator:**
   - Visit https://www.qr-code-generator.com/
   - Enter the URL for each boat
   - Download the QR code image
   - Print and attach to the boat

2. **Command Line (if you have qrencode installed):**
   ```bash
   qrencode -o boat-6.png "https://yourdomain.com/qr/boat-6"
   qrencode -o boat-7.png "https://yourdomain.com/qr/boat-7"
   # ... repeat for all boats
   ```

3. **Using a QR Code API:**
   ```
   https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://yourdomain.com/qr/boat-6
   ```

## Special Notes for Shared Boats

- **Kayaks and Paddle Boards** can be used by multiple people simultaneously
- Each person scans the same QR code but gets their own check-in record
- The system will show how many people are currently using these boats
- No need to wait for someone to return before checking out

## Database Update

The database has been updated with:
- New `boat_type` field ('individual' or 'shared')
- All new boats added to the boats table
- Special handling for shared boats in the check-in logic

## Testing

After generating QR codes:
1. Test each QR code to ensure it loads the correct boat page
2. Verify that individual boats show "already in use" when checked out
3. Verify that shared boats allow multiple check-outs
4. Check the admin dashboard to see all boats listed correctly 