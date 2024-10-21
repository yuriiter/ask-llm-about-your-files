import json
from core.interfaces import FileProcessorInterface
import pymupdf
import io
from typing import List, Dict, Union
import base64
from uuid import uuid4

def recoverpix(doc, item):
    xref = item[0]

    try:
        pix = pymupdf.Pixmap(doc.extract_image(xref)["image"])
        if pix.alpha:
            pix = pymupdf.Pixmap(pix, 0)

        if pix.n > 3:
            ext = "pam"
        else:
            ext = "png"

        return {
            "ext": ext,
            "colorspace": pix.colorspace.n,
            "image": pix.tobytes(ext),
        }
    except:
        return None

class PDFProcessor(FileProcessorInterface):
    def process(self, file_content: bytes, file_name: str) -> List[Dict[str, Union[str, bytes]]]:
        file_id = str(uuid4())
        pdf_document = pymupdf.open(stream=file_content, filetype="pdf")
        result = []
        for page_num in range(len(pdf_document)):
            page = pdf_document[page_num]
            
            text = page.get_text()
            
            if text.strip():
                chunks = self.chunk_text(text.strip())
                for chunk_num, chunk in enumerate(chunks, 1):
                    result.append({
                        "file_id": file_id,
                        "type": "text",
                        "content": chunk,
                        "metadata": {
                            "page_number": page_num + 1,
                            "chunk_number": chunk_num,
                            "file_name": file_name,
                        }
                    })
            

        images = self.extract_images(pdf_document, file_name, file_id)
        result.extend(images)

        pdf_document.close()
        return result


    def extract_images(self, document: pymupdf.Document, file_name: str, file_id: str) -> List[Dict[str, Union[str, bytes, Dict]]]:
        page_count = document.page_count
        xreflist = []
        images = []
        for page_number in range(page_count):
            il = document.get_page_images(page_number)
            for image_idx, img in enumerate(il):
                xref = img[0]
                if xref in xreflist:
                    continue
                image = recoverpix(document, img)
                if image is None:
                    continue
                imgdata = image["image"]

                image_data = base64.b64encode(imgdata).decode('utf-8')
                images.append({
                    "file_id": file_id,
                    "type": "image",
                    "content": image_data,
                    "metadata": {
                        "page_number": page_number,
                        "image_index": image_idx,
                        "file_name": file_name
                    }
                })
                xreflist.append(xref)

        return images
