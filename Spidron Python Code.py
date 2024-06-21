import tkinter as tk
from tkinter import messagebox
import math

def calculate_area(x, n, k):
    # Convert degrees to radians for trigonometric functions
    factor = math.pi / 180
    
    sin_part1 = math.sin(180 * factor / n)
    sin_part2 = math.sin(180 * factor * (n - 3) / n)
    sin_part3 = math.sin(180 * factor * (n - 4) / n)
    sin_part4 = math.sin(360 * factor / n)
    sin_part5 = math.sin(180 * factor / n)
    
    # Calculate the numerator
    numerator = (1/2) * x**2 * (sin_part1 / sin_part4)*sin_part2 * (1 - ((sin_part3 * sin_part5)** 2 / sin_part4 ** 4) ** k)
    
    # Calculate the denominator
    denominator = 1 - (sin_part3 ** 2 * (sin_part5 ** 2 / sin_part4 ** 4))
    
    # Calculate the area
    area = numerator / denominator
    return area

def on_calculate():
    try:
        x = float(entry_x.get())
        n = float(entry_n.get())
        k = float(entry_k.get())
        area = calculate_area(x, n, k)
        result_var.set(f"Calculated area: {area:.3f}")
    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers")

# Create the main window
root = tk.Tk()
root.title("คำนวณพื้นที่รูปสไปดรอน")

# Set the window size
root.geometry("400x200")

# Create and place the widgets
tk.Label(root, text="Enter x:").grid(row=0, column=0, padx=10, pady=10)
entry_x = tk.Entry(root)
entry_x.grid(row=0, column=1, padx=10, pady=10)

tk.Label(root, text="Enter n:").grid(row=1, column=0, padx=10, pady=10)
entry_n = tk.Entry(root)
entry_n.grid(row=1, column=1, padx=10, pady=10)

tk.Label(root, text="Enter k:").grid(row=2, column=0, padx=10, pady=10)
entry_k = tk.Entry(root)
entry_k.grid(row=2, column=1, padx=10, pady=10)

btn_calculate = tk.Button(root, text="Calculate", command=on_calculate)
btn_calculate.grid(row=3, column=0, columnspan=2, pady=10)

# Label to show the result
result_var = tk.StringVar()
result_label = tk.Label(root, textvariable=result_var)
result_label.grid(row=4, column=0, columnspan=2, padx=10, pady=10)

# Start the GUI event loop
root.mainloop()
