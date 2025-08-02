import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Create HTML page with embedded PDF using object tag
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>CV Preview</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            height: 100vh;
            overflow: hidden;
        }
        .pdf-container {
            width: 100%;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .pdf-header {
            background: white;
            padding: 10px 20px;
            border-bottom: 1px solid #ddd;
            font-size: 14px;
            color: #666;
        }
        .pdf-viewer {
            flex: 1;
            width: 100%;
            border: none;
            background: white;
        }
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: white;
            color: #666;
        }
        .error {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #ffebee;
            color: #d32f2f;
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="pdf-container">
        <div class="pdf-header">CV Preview</div>
        <object 
            class="pdf-viewer" 
            data="/api/preview-cv/${params.id}" 
            type="application/pdf"
            onload="hideLoading()"
            onerror="showError()">
            <div class="error">
                <div>
                    <h3>PDF Preview Not Available</h3>
                    <p>Your browser doesn't support PDF preview.</p>
                    <p>Please download the PDF to view it.</p>
                </div>
            </div>
        </object>
    </div>

    <script>
        function hideLoading() {
            console.log('PDF loaded successfully');
        }
        
        function showError() {
            console.log('PDF failed to load');
        }

        // Fallback for browsers that don't support object tag with PDFs
        window.addEventListener('load', function() {
            setTimeout(function() {
                const object = document.querySelector('object');
                if (object && !object.contentDocument) {
                    // If object tag doesn't work, try iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = '/api/preview-cv/${params.id}';
                    iframe.className = 'pdf-viewer';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = 'none';
                    object.parentNode.replaceChild(iframe, object);
                }
            }, 1000);
        });
    </script>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Error in PDF viewer:", error)

    const errorHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Preview Error</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 50px; text-align: center; background: #f5f5f5; }
        .error { color: #d32f2f; background: #ffebee; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="error">
        <h2>Preview Error</h2>
        <p>Unable to load CV preview. Please try downloading the PDF instead.</p>
        <p><small>Error: ${error.message}</small></p>
    </div>
</body>
</html>`

    return new NextResponse(errorHtml, {
      headers: { "Content-Type": "text/html" },
      status: 500,
    })
  }
}
