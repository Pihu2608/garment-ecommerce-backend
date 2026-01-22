import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../services/product_service.dart';
import '../models/product.dart';

class AddProductScreen extends StatefulWidget {
  final Product? product; // 👈 null = add, not null = edit

  const AddProductScreen({super.key, this.product});

  @override
  State<AddProductScreen> createState() => _AddProductScreenState();
}

class _AddProductScreenState extends State<AddProductScreen> {
  final nameCtrl = TextEditingController();
  final priceCtrl = TextEditingController();
  final descCtrl = TextEditingController();

  File? imageFile;
  bool loading = false;

  bool get isEdit => widget.product != null;

  @override
  void initState() {
    super.initState();
    if (isEdit) {
      nameCtrl.text = widget.product!.name;
      priceCtrl.text = widget.product!.price.toString();
      descCtrl.text = widget.product!.description;
    }
  }

  Future pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => imageFile = File(picked.path));
    }
  }

  Future submit() async {
    if (nameCtrl.text.isEmpty ||
        priceCtrl.text.isEmpty ||
        descCtrl.text.isEmpty ||
        (!isEdit && imageFile == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("All fields required")),
      );
      return;
    }

    setState(() => loading = true);

    bool ok;

    if (isEdit) {
      ok = await ProductService.updateProduct(
        id: widget.product!.id,
        name: nameCtrl.text,
        price: priceCtrl.text,
        description: descCtrl.text,
        imageFile: imageFile,
      );
    } else {
      ok = await ProductService.addProduct(
        name: nameCtrl.text,
        price: priceCtrl.text,
        description: descCtrl.text,
        imageFile: imageFile!,
      );
    }

    setState(() => loading = false);

    if (ok) {
      Navigator.pop(context, true);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(isEdit ? "Update failed" : "Upload failed")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(isEdit ? "Edit Product" : "Add Product")),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: ElevatedButton(
          onPressed: loading ? null : submit,
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(double.infinity, 50),
          ),
          child: loading
              ? const CircularProgressIndicator(color: Colors.white)
              : Text(isEdit ? "UPDATE PRODUCT" : "ADD PRODUCT"),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
        child: Column(
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: "Name"),
            ),
            TextField(
              controller: priceCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: "Price"),
            ),
            TextField(
              controller: descCtrl,
              decoration: const InputDecoration(labelText: "Description"),
            ),
            const SizedBox(height: 15),
            GestureDetector(
              onTap: pickImage,
              child: Container(
                height: 160,
                width: double.infinity,
                color: Colors.grey[200],
                child: imageFile != null
                    ? Image.file(imageFile!, fit: BoxFit.cover)
                    : isEdit
                        ? Image.network(widget.product!.image,
                            fit: BoxFit.cover)
                        : const Center(child: Text("Tap to pick image")),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
