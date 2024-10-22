from core.interfaces import FileProcessorInterface
import pymupdf
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

class ImageProcessor(FileProcessorInterface):
    def process(self, file_content: bytes, file_name: str) -> List[Dict[str, Union[str, bytes, dict]]]:
        file_id = str(uuid4())
        image_data = base64.b64encode(file_content).decode('utf-8')

        return [{
            "file_id": file_id,
            "type": "image",
            "content": image_data,
            "metadata": {
                "file_name": file_name
            }
        }]
