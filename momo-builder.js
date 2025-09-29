// MOMO BUILDER - GERADOR DE PÁGINAS PERSONALIZADAS
// Criador automático de HTML personalizado com templates

class MoMoBuilder {
    constructor() {
        this.images = [];
        this.selectedTemplate = 'minimal';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePreview();
        console.log('🎨 MoMo Builder inicializado!');
    }

    setupEventListeners() {
        // Upload de imagens
        const imageUpload = document.getElementById('imageUpload');
        const imageInput = document.getElementById('imageInput');

        imageUpload.addEventListener('click', () => imageInput.click());
        imageInput.addEventListener('change', (e) => this.handleImageUpload(e.target.files));

        // Drag & Drop
        imageUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUpload.classList.add('dragover');
        });

        imageUpload.addEventListener('dragleave', () => {
            imageUpload.classList.remove('dragover');
        });

        imageUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUpload.classList.remove('dragover');
            this.handleImageUpload(e.dataTransfer.files);
        });

        // Template selection
        document.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => this.selectTemplate(card.dataset.template));
        });

        // Auto-update preview
        ['pageTitle', 'pageSubtitle', 'pageContent', 'backgroundColor'].forEach(id => {
            const element = document.getElementById(id);
            element.addEventListener('input', () => this.updatePreview());
        });
    }

    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.images.push({
                        name: file.name,
                        data: e.target.result,
                        id: Date.now() + Math.random()
                    });
                    this.updateImagePreview();
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    updateImagePreview() {
        const container = document.getElementById('uploadedImages');
        container.innerHTML = '';

        this.images.forEach(image => {
            const div = document.createElement('div');
            div.className = 'image-preview';
            div.innerHTML = `
                <img src="${image.data}" alt="${image.name}">
                <button class="remove" onclick="builder.removeImage('${image.id}')">×</button>
            `;
            container.appendChild(div);
        });
    }

    removeImage(id) {
        this.images = this.images.filter(img => img.id != id);
        this.updateImagePreview();
        this.updatePreview();
    }

    selectTemplate(templateName) {
        document.querySelectorAll('.template-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-template="${templateName}"]`).classList.add('selected');
        this.selectedTemplate = templateName;
        this.updatePreview();
    }

    generateHTML() {
        const title = document.getElementById('pageTitle').value || 'Minha Página';
        const subtitle = document.getElementById('pageSubtitle').value || 'Criada com MoMo Builder';
        const content = document.getElementById('pageContent').value || 'Conteúdo da página...';
        const bgColor = document.getElementById('backgroundColor').value;

        const templates = {
            minimal: this.generateMinimalTemplate(title, subtitle, content, bgColor),
            gallery: this.generateGalleryTemplate(title, subtitle, content, bgColor),
            portfolio: this.generatePortfolioTemplate(title, subtitle, content, bgColor),
            blog: this.generateBlogTemplate(title, subtitle, content, bgColor),
            romantic: this.generateRomanticTemplate(title, subtitle, content, bgColor),
            fun: this.generateFunTemplate(title, subtitle, content, bgColor)
        };

        return templates[this.selectedTemplate] || templates.minimal;
    }

    getBackgroundStyle(bgColor) {
        const backgrounds = {
            gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            dark: '#2d3748',
            light: '#f7fafc'
        };
        return backgrounds[bgColor] || backgrounds.gradient1;
    }

    generateImageGallery() {
        if (this.images.length === 0) return '';
        
        return `
            <div class="image-gallery">
                ${this.images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.data}" alt="${img.name}">
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateMinimalTemplate(title, subtitle, content, bgColor) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${this.getBackgroundStyle(bgColor)};
            min-height: 100vh;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            text-align: center;
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
        }
        .content {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #555;
            margin-bottom: 30px;
            white-space: pre-line;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .gallery-item {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            transition: transform 0.3s;
        }
        .gallery-item img:hover {
            transform: scale(1.05);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #888;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
        <div class="content">${content}</div>
        ${this.generateImageGallery()}
        <div class="footer">Criado com 💝 usando MoMo Builder</div>
    </div>
</body>
</html>`;
    }

    generateGalleryTemplate(title, subtitle, content, bgColor) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${this.getBackgroundStyle(bgColor)};
            color: white;
        }
        .header {
            text-align: center;
            padding: 60px 20px;
        }
        .header h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .header .subtitle {
            font-size: 1.5rem;
            opacity: 0.9;
        }
        .content-section {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
        }
        .content {
            font-size: 1.2rem;
            line-height: 1.8;
            margin-bottom: 50px;
            white-space: pre-line;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 50px 0;
        }
        .gallery-item {
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s;
        }
        .gallery-item:hover {
            transform: translateY(-10px);
        }
        .gallery-item img {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }
        .footer {
            text-align: center;
            padding: 40px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${title}</h1>
        <p class="subtitle">${subtitle}</p>
    </div>
    <div class="content-section">
        <div class="content">${content}</div>
        ${this.generateImageGallery()}
        <div class="footer">✨ Galeria criada com MoMo Builder ✨</div>
    </div>
</body>
</html>`;
    }

    generateRomanticTemplate(title, subtitle, content, bgColor) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Georgia', serif;
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
            min-height: 100vh;
            color: #333;
            overflow-x: hidden;
        }
        .hearts {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
        .heart {
            position: absolute;
            font-size: 20px;
            color: rgba(255, 182, 193, 0.7);
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10%, 90% { opacity: 1; }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        .container {
            position: relative;
            z-index: 2;
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 20px;
            text-align: center;
        }
        .header {
            margin-bottom: 50px;
        }
        .header h1 {
            font-size: 4rem;
            color: #d63384;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .subtitle {
            font-size: 1.5rem;
            color: #6f42c1;
            margin-bottom: 30px;
        }
        .content {
            background: rgba(255, 255, 255, 0.9);
            padding: 40px;
            border-radius: 25px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
            font-size: 1.2rem;
            line-height: 1.8;
            white-space: pre-line;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 25px;
            margin: 40px 0;
        }
        .gallery-item {
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: 3px solid rgba(255, 182, 193, 0.5);
            transition: transform 0.3s;
        }
        .gallery-item:hover {
            transform: rotate(2deg) scale(1.05);
        }
        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .footer {
            margin-top: 50px;
            color: #6f42c1;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <div class="hearts"></div>
    <div class="container">
        <div class="header">
            <h1>💕 ${title} 💕</h1>
            <p class="subtitle">${subtitle}</p>
        </div>
        <div class="content">${content}</div>
        ${this.generateImageGallery()}
        <div class="footer">Feito com muito 💖 usando MoMo Builder</div>
    </div>
    
    <script>
        // Animação de corações
        function createHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '💖';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDelay = Math.random() * 6 + 's';
            heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
            document.querySelector('.hearts').appendChild(heart);
            
            setTimeout(() => heart.remove(), 8000);
        }
        
        setInterval(createHeart, 800);
        
        // Criar alguns corações iniciais
        for(let i = 0; i < 5; i++) {
            setTimeout(createHeart, i * 1000);
        }
    </script>
</body>
</html>`;
    }

    generatePortfolioTemplate(title, subtitle, content, bgColor) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${this.getBackgroundStyle(bgColor)};
            color: #333;
            line-height: 1.6;
        }
        .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px 0;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            z-index: 100;
        }
        .navbar .container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
        }
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }
        .hero {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }
        .hero h1 {
            font-size: 5rem;
            margin-bottom: 20px;
            text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .hero .subtitle {
            font-size: 2rem;
            margin-bottom: 30px;
            opacity: 0.9;
        }
        .section {
            padding: 100px 0;
            max-width: 1200px;
            margin: 0 auto;
        }
        .section-white {
            background: white;
            color: #333;
        }
        .content {
            padding: 0 20px;
            font-size: 1.2rem;
            text-align: center;
            white-space: pre-line;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            padding: 60px 20px;
        }
        .gallery-item {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        .gallery-item:hover {
            transform: translateY(-10px);
        }
        .gallery-item img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 40px 20px;
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="logo">${title}</div>
        </div>
    </nav>
    
    <section class="hero">
        <div>
            <h1>${title}</h1>
            <p class="subtitle">${subtitle}</p>
        </div>
    </section>
    
    <section class="section section-white">
        <div class="content">${content}</div>
        ${this.generateImageGallery()}
    </section>
    
    <footer class="footer">
        <p>© 2025 ${title} | Criado com MoMo Builder 🚀</p>
    </footer>
</body>
</html>`;
    }

    generateBlogTemplate(title, subtitle, content, bgColor) {
        const currentDate = new Date().toLocaleDateString('pt-BR');
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Georgia', serif;
            background: ${this.getBackgroundStyle(bgColor)};
            color: #333;
            line-height: 1.8;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            min-height: 100vh;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: #667eea;
            color: white;
            text-align: center;
            padding: 60px 20px;
        }
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
        }
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .article {
            padding: 60px 40px;
        }
        .article-meta {
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
            margin-bottom: 40px;
            text-align: center;
            color: #666;
        }
        .content {
            font-size: 1.1rem;
            margin-bottom: 40px;
            white-space: pre-line;
        }
        .image-gallery {
            margin: 50px 0;
        }
        .gallery-item {
            margin: 30px 0;
            text-align: center;
        }
        .gallery-item img {
            width: 100%;
            max-width: 600px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        .footer {
            background: #f8f9fa;
            padding: 40px;
            text-align: center;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${title}</h1>
            <p class="subtitle">${subtitle}</p>
        </header>
        
        <article class="article">
            <div class="article-meta">
                <p>📅 Publicado em ${currentDate}</p>
            </div>
            
            <div class="content">${content}</div>
            
            <div class="image-gallery">
                ${this.images.map(img => `
                    <div class="gallery-item">
                        <img src="${img.data}" alt="${img.name}">
                    </div>
                `).join('')}
            </div>
        </article>
        
        <footer class="footer">
            <p>📝 Artigo criado com MoMo Builder</p>
        </footer>
    </div>
</body>
</html>`;
    }

    generateFunTemplate(title, subtitle, content, bgColor) {
        return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Comic Sans MS', cursive;
            background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4d79ff, #ff6b6b);
            background-size: 400% 400%;
            animation: gradientShift 8s ease infinite;
            color: #333;
            overflow-x: hidden;
        }
        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 50px;
            animation: bounce 2s ease infinite;
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        .header h1 {
            font-size: 4rem;
            color: white;
            text-shadow: 3px 3px 0px #333, 6px 6px 10px rgba(0, 0, 0, 0.3);
            margin-bottom: 20px;
            transform: rotate(-2deg);
        }
        .subtitle {
            font-size: 1.8rem;
            color: #fff;
            background: rgba(0, 0, 0, 0.2);
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
            transform: rotate(1deg);
        }
        .content-box {
            background: rgba(255, 255, 255, 0.95);
            padding: 40px;
            border-radius: 25px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            margin: 40px 0;
            transform: rotate(-1deg);
            border: 5px dashed #ff6b6b;
        }
        .content {
            font-size: 1.3rem;
            line-height: 1.8;
            white-space: pre-line;
        }
        .image-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 50px 0;
        }
        .gallery-item {
            border-radius: 25px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s;
            border: 4px solid #fff;
        }
        .gallery-item:hover {
            transform: rotate(5deg) scale(1.1);
        }
        .gallery-item:nth-child(even) {
            transform: rotate(-2deg);
        }
        .gallery-item:nth-child(odd) {
            transform: rotate(2deg);
        }
        .gallery-item img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .emojis {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        .emoji {
            position: absolute;
            font-size: 30px;
            animation: float 6s linear infinite;
        }
        @keyframes float {
            0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10%, 90% { opacity: 1; }
            100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        .footer {
            text-align: center;
            margin-top: 60px;
            background: rgba(255, 255, 255, 0.9);
            padding: 30px;
            border-radius: 20px;
            font-size: 1.2rem;
            transform: rotate(1deg);
        }
    </style>
</head>
<body>
    <div class="emojis"></div>
    
    <div class="container">
        <div class="header">
            <h1>🎉 ${title} 🎉</h1>
            <p class="subtitle">🌟 ${subtitle} 🌟</p>
        </div>
        
        <div class="content-box">
            <div class="content">${content}</div>
        </div>
        
        ${this.generateImageGallery()}
        
        <div class="footer">
            🎨 Criado com muita diversão no MoMo Builder! 🚀✨
        </div>
    </div>
    
    <script>
        // Animação de emojis flutuantes
        const emojis = ['🎉', '🎊', '✨', '🌟', '🎈', '🎁', '🎀', '💫', '🌈', '🦄'];
        
        function createEmoji() {
            const emoji = document.createElement('div');
            emoji.className = 'emoji';
            emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.left = Math.random() * 100 + '%';
            emoji.style.animationDelay = Math.random() * 2 + 's';
            emoji.style.animationDuration = (Math.random() * 4 + 4) + 's';
            document.querySelector('.emojis').appendChild(emoji);
            
            setTimeout(() => emoji.remove(), 8000);
        }
        
        setInterval(createEmoji, 500);
        
        // Criar alguns emojis iniciais
        for(let i = 0; i < 8; i++) {
            setTimeout(createEmoji, i * 200);
        }
    </script>
</body>
</html>`;
    }

    updatePreview() {
        const html = this.generateHTML();
        const preview = document.getElementById('preview');
        const codeOutput = document.getElementById('codeOutput');
        
        // Atualizar preview
        const blob = new Blob([html], { type: 'text/html' });
        preview.src = URL.createObjectURL(blob);
        
        // Atualizar código
        codeOutput.textContent = html;
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Funções globais
let builder;

document.addEventListener('DOMContentLoaded', () => {
    builder = new MoMoBuilder();
});

function updatePreview() {
    builder.updatePreview();
}

function downloadHTML() {
    const html = builder.generateHTML();
    const title = document.getElementById('pageTitle').value || 'minha-pagina';
    const filename = title.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    builder.showNotification('📥 HTML baixado com sucesso!');
}

function copyCode() {
    const html = builder.generateHTML();
    navigator.clipboard.writeText(html).then(() => {
        builder.showNotification('📋 Código copiado!');
    }).catch(() => {
        builder.showNotification('❌ Erro ao copiar código', 'error');
    });
}