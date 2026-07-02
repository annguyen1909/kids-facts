import cv2
import numpy as np

# Load the image with alpha channel
img = cv2.imread('/Users/annguyen19/Desktop/CODE/wildlifedb/public/brand/logo-side-nobg.png', cv2.IMREAD_UNCHANGED)

# Create a mask of the opaque pixels
alpha_channel = img[:, :, 3]
_, binary_mask = cv2.threshold(alpha_channel, 50, 255, cv2.THRESH_BINARY)

# Find contours in the mask
contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Find the largest contour (the lion)
largest_contour = max(contours, key=cv2.contourArea)

# Create a new mask with only the largest contour
new_mask = np.zeros_like(alpha_channel)
cv2.drawContours(new_mask, [largest_contour], -1, 255, thickness=cv2.FILLED)

# Apply the new mask to the alpha channel
img[:, :, 3] = cv2.bitwise_and(alpha_channel, new_mask)

# Save the result
cv2.imwrite('/Users/annguyen19/Desktop/CODE/wildlifedb/public/brand/logo-side-nobg-noring.png', img)
print("Removed ring and saved to logo-side-nobg-noring.png")
