// MASTER IMAGE EDITOR - EDITOR COMPLETO COM TODAS AS FUNCIONALIDADES
// Sistema completo: layers multicamadas, ferramentas avançadas, filtros pixel-perfect, UI PhotoShop

class MasterImageEditor {
    constructor(canvasId) {
        console.log('🚀 Inicializando Master Image Editor...');
        
        try {
            // Canvas principal e contextos
            this.canvas = document.getElementById(canvasId);
            if (!this.canvas) {
                throw new Error(`Canvas com ID '${canvasId}' não encontrado!`);
            }
            console.log('✅ Canvas encontrado:', canvasId);
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) {
                throw new Error('Não foi possível obter contexto 2D do canvas!');
            }
            
            // Canvas de overlay para previews e seleções
            this.overlayCanvas = document.createElement('canvas');
            this.overlayCtx = this.overlayCanvas.getContext('2d');
            
            // Canvas de backup para operações
            this.backupCanvas = document.createElement('canvas');
            this.backupCtx = this.backupCanvas.getContext('2d');
            
            console.log('✅ Contextos de canvas criados');
        
        // Sistema complexo de layers
        this.layers = [];
        this.activeLayerIndex = 0;
        this.layerIdCounter = 0;
        
        // Sistema avançado de ferramentas
        this.currentTool = 'brush';
        this.toolSettings = {
            brush: { 
                size: 5, 
                hardness: 100, 
                opacity: 100,
                color: '#000000',
                blendMode: 'source-over'
            },
            eraser: { 
                size: 20, 
                opacity: 100,
                mode: 'destination-out'
            },
            bucket: { 
                tolerance: 32, 
                color: '#000000'
            },
            eyedropper: { },
            text: {
                font: 'Arial',
                size: 24,
                color: '#000000'
            }
        };
        
        // Estado de desenho
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        
        // Sistema robusto de seleção
        this.selection = {
            active: false,
            type: 'rectangle',
            bounds: { x: 0, y: 0, width: 0, height: 0 },
            marchingAnts: { offset: 0, timer: null }
        };
        
        // Sistema de histórico avançado
        this.history = [];
        this.historyStep = -1;
        this.maxHistorySteps = 50;
            
            this.initialize();
            console.log('✅ Master Image Editor inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização do Master Image Editor:', error);
            this.showNotification('Erro ao inicializar editor: ' + error.message, 'error');
            throw error;
        }
    }

    initialize() {
        this.setupCanvas();
        this.setupEventListeners();
        this.createInitialDocument();
        
        console.log('✅ Master Image Editor inicializado com sucesso!');
    }

    setupCanvas() {
        try {
            console.log('🔧 Configurando canvas...');
            
            // Configurar canvas overlay
            this.overlayCanvas.width = this.canvas.width;
            this.overlayCanvas.height = this.canvas.height;
            this.overlayCanvas.style.position = 'absolute';
            this.overlayCanvas.style.top = this.canvas.offsetTop + 'px';
            this.overlayCanvas.style.left = this.canvas.offsetLeft + 'px';
            this.overlayCanvas.style.pointerEvents = 'none';
            this.overlayCanvas.style.zIndex = '10';
        
        // Inserir overlay na DOM
        const canvasParent = this.canvas.parentElement;
        if (canvasParent) {
            canvasParent.style.position = 'relative';
            canvasParent.appendChild(this.overlayCanvas);
        }
        
        // Configurar backup canvas
        this.backupCanvas.width = this.canvas.width;
        this.backupCanvas.height = this.canvas.height;
        
        // Configurações de qualidade máxima
        [this.ctx, this.overlayCtx, this.backupCtx].forEach(ctx => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        });
        
        console.log('✅ Canvas configurado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao configurar canvas:', error);
            throw error;
        }
    }

    setupEventListeners() {
        try {
            console.log('🔌 Configurando event listeners...');
            
            // Mouse events
            this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
            this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
            this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
            this.canvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
            this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events para mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            // Keyboard events
            document.addEventListener('keydown', this.handleKeyDown.bind(this));
            
            console.log('✅ Event listeners configurados');
        } catch (error) {
            console.error('❌ Erro ao configurar event listeners:', error);
            throw error;
        }
    }

    // ========== SISTEMA DE DOCUMENTO E LAYERS ==========

    createInitialDocument(width = 800, height = 600) {
        try {
            console.log(`🎨 Criando documento: ${width}x${height}`);
            
            this.resizeCanvas(width, height);
            
            // Layer de fundo
            const backgroundLayer = this.createLayer('Background', width, height);
            backgroundLayer.ctx.fillStyle = '#ffffff';
            backgroundLayer.ctx.fillRect(0, 0, width, height);
            
            this.layers.push(backgroundLayer);
            this.activeLayerIndex = 0;
            this.render();
            this.saveState('New Document');
            
            console.log('✅ Documento inicial criado');
        } catch (error) {
            console.error('❌ Erro ao criar documento inicial:', error);
            this.showNotification('Erro ao criar documento: ' + error.message, 'error');
        }
    }

    createLayer(name, width, height) {
        try {
            console.log('🎨 Criando layer:', name, 'dimensões:', width, height);
            
            const layer = {
                id: ++this.layerIdCounter,
                name: name || `Layer ${this.layerIdCounter}`,
                canvas: document.createElement('canvas'),
                ctx: null,
                visible: true,
                opacity: 1.0,
                blendMode: 'source-over',
                locked: false
            };
            
            const layerWidth = width || this.canvas.width;
            const layerHeight = height || this.canvas.height;
            
            layer.canvas.width = layerWidth;
            layer.canvas.height = layerHeight;
            layer.ctx = layer.canvas.getContext('2d');
            
            if (!layer.ctx) {
                throw new Error('Não foi possível obter contexto 2D para a layer');
            }
            
            layer.ctx.imageSmoothingEnabled = true;
            layer.ctx.imageSmoothingQuality = 'high';
            
            console.log(`✅ Layer criada: ${layer.name} (${layerWidth}x${layerHeight})`);
            return layer;
        } catch (error) {
            console.error('❌ Erro ao criar layer:', error);
            throw error;
        }
    }

    addLayer(name, insertIndex = -1) {
        try {
            console.log('🎨 Criando nova layer:', name);
            
            const layer = this.createLayer(name);
            if (!layer) {
                throw new Error('Falha ao criar layer');
            }
            
            if (insertIndex === -1 || insertIndex >= this.layers.length) {
                this.layers.push(layer);
                this.activeLayerIndex = this.layers.length - 1;
            } else {
                this.layers.splice(insertIndex, 0, layer);
                this.activeLayerIndex = insertIndex;
            }
            
            this.render();
            this.saveState(`Add Layer: ${layer.name}`);
            
            console.log(`➕ Layer '${layer.name}' criada (ID: ${layer.id}), total layers: ${this.layers.length}`);
            return layer;
        } catch (error) {
            console.error('❌ Erro ao adicionar layer:', error);
            this.showNotification('Erro ao criar layer: ' + error.message, 'error');
            return null;
        }
    }

    removeLayer(index = this.activeLayerIndex) {
        if (this.layers.length <= 1) {
            console.warn('⚠️ Não é possível remover a única layer');
            return false;
        }
        
        const removedLayer = this.layers.splice(index, 1)[0];
        this.activeLayerIndex = Math.min(this.activeLayerIndex, this.layers.length - 1);
        
        this.render();
        this.saveState(`Remove Layer: ${removedLayer.name}`);
        
        console.log(`🗑️ Layer '${removedLayer.name}' removida`);
        return true;
    }

    // ========== SISTEMA DE ARQUIVO AVANÇADO ==========

    loadImageFromFile(file) {
        console.log('📁 Carregando arquivo:', file?.name, file?.type);
        
        if (!file || !file.type.startsWith('image/')) {
            const msg = 'Por favor selecione um arquivo de imagem válido!';
            console.warn('⚠️', msg);
            if (this.showNotification) {
                this.showNotification(msg, 'error');
            }
            return Promise.reject(new Error('Invalid file type'));
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    // Redimensionar canvas para a imagem
                    this.resizeCanvas(img.width, img.height);
                    
                    // Limpar layers existentes
                    this.layers = [];
                    
                    // Criar layer para a imagem
                    const imageLayer = this.createLayer(file.name, img.width, img.height);
                    imageLayer.ctx.drawImage(img, 0, 0);
                    
                    this.layers.push(imageLayer);
                    this.activeLayerIndex = 0;
                    
                    this.render();
                    this.saveState(`Load Image: ${file.name}`);
                    
                    this.showNotification(`✅ Imagem carregada: ${file.name} (${img.width}x${img.height})`, 'success');
                    
                    console.log('✅ Imagem carregada:', file.name, `${img.width}x${img.height}`);
                    resolve({ width: img.width, height: img.height, name: file.name });
                };
                
                img.onerror = () => {
                    const error = new Error('Erro ao carregar imagem!');
                    this.showNotification('Erro ao carregar imagem!', 'error');
                    reject(error);
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                const error = new Error('Erro ao ler arquivo!');
                this.showNotification('Erro ao ler arquivo!', 'error');
                reject(error);
            };
            
            reader.readAsDataURL(file);
        });
    }

    // Drag & Drop avançado
    setupDragAndDrop(dropZone = document.body) {
        let dragCounter = 0;
        
        dropZone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            dragCounter++;
            this.showDropZone(true);
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragCounter--;
            if (dragCounter === 0) {
                this.showDropZone(false);
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dragCounter = 0;
            this.showDropZone(false);
            
            const files = Array.from(e.dataTransfer.files);
            const imageFile = files.find(file => file.type.startsWith('image/'));
            
            if (imageFile) {
                this.loadImageFromFile(imageFile);
            } else {
                this.showNotification('Nenhum arquivo de imagem encontrado!', 'warning');
            }
        });
    }

    // Save/Export avançado
    saveImage(format = 'png', quality = 1.0) {
        try {
            const mimeType = `image/${format}`;
            const dataUrl = this.canvas.toDataURL(mimeType, quality);
            
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `image-editor-${timestamp}.${format}`;
            
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification(`💾 Imagem salva: ${filename}`, 'success');
            console.log('✅ Imagem salva:', filename);
            
            return { filename, size: dataUrl.length, format };
        } catch (error) {
            console.error('Erro ao salvar:', error);
            this.showNotification('Erro ao salvar imagem!', 'error');
            throw error;
        }
    }

    // ========== SISTEMA DE FERRAMENTAS ==========

    setTool(toolName) {
        const previousTool = this.currentTool;
        this.currentTool = toolName;
        
        // Atualizar cursor
        this.updateCursor();
        
        console.log(`🛠️ Ferramenta alterada: ${previousTool} → ${toolName}`);
    }

    updateCursor() {
        const cursors = {
            brush: 'crosshair',
            eraser: 'crosshair',
            bucket: 'crosshair',
            eyedropper: 'crosshair',
            text: 'text',
            move: 'move',
            select: 'crosshair'
        };
        
        this.canvas.style.cursor = cursors[this.currentTool] || 'default';
    }

    // ========== EVENT HANDLERS ==========

    handleMouseDown(e) {
        try {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.isDrawing = true;
            this.lastX = x;
            this.lastY = y;
            
            this.executeToolAction(x, y, 'start', e);
        } catch (error) {
            console.error('❌ Erro no mousedown:', error);
        }
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (this.isDrawing) {
            this.executeToolAction(x, y, 'move', e);
        }
        
        this.lastX = x;
        this.lastY = y;
    }

    handleMouseUp(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.executeToolAction(x, y, 'end', e);
        this.isDrawing = false;
    }

    executeToolAction(x, y, phase, event) {
        try {
            const activeLayer = this.getActiveLayer();
            if (!activeLayer) {
                console.warn('⚠️ Não há layer ativa');
                return;
            }
            
            if (activeLayer.locked) {
                if (phase === 'start') {
                    this.showNotification('Layer está bloqueada!', 'warning');
                }
                return;
            }

            switch (this.currentTool) {
                case 'brush':
                    this.handleBrushTool(x, y, phase);
                    break;
                case 'eraser':
                    this.handleEraserTool(x, y, phase);
                    break;
                case 'bucket':
                    this.handleBucketTool(x, y, phase);
                    break;
                case 'eyedropper':
                    this.handleEyedropperTool(x, y, phase);
                    break;
                case 'text':
                    this.handleTextTool(x, y, phase);
                    break;
                default:
                    console.warn('⚠️ Ferramenta desconhecida:', this.currentTool);
            }
        } catch (error) {
            console.error('❌ Erro ao executar ação da ferramenta:', error);
            this.showNotification('Erro na ferramenta: ' + error.message, 'error');
        }
    }

    // ========== IMPLEMENTAÇÕES DAS FERRAMENTAS ==========

    // Brush Tool
    handleBrushTool(x, y, phase) {
        try {
            const settings = this.toolSettings.brush;
            const activeLayer = this.getActiveLayer();
            
            if (!activeLayer || !activeLayer.ctx) {
                console.error('❌ Layer ativa ou contexto não disponível para brush');
                return;
            }
            
            const ctx = activeLayer.ctx;
            
            switch (phase) {
                case 'start':
                    ctx.save();
                    ctx.globalAlpha = (settings.opacity || 100) / 100;
                    ctx.globalCompositeOperation = settings.blendMode || 'source-over';
                    ctx.strokeStyle = settings.color || '#000000';
                    ctx.fillStyle = settings.color || '#000000';
                    ctx.lineWidth = settings.size || 5;
                    ctx.lineCap = 'round';
                    
                    // Ponto inicial
                    ctx.beginPath();
                    ctx.arc(x, y, (settings.size || 5) / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                
                case 'move':
                    ctx.lineWidth = settings.size || 5;
                    ctx.beginPath();
                    ctx.moveTo(this.lastX || x, this.lastY || y);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                    break;
                    
                case 'end':
                    ctx.restore();
                    this.render();
                    this.saveState('Brush');
                    break;
            }
        } catch (error) {
            console.error('❌ Erro no handleBrushTool:', error);
        }
    }    // Eraser Tool
    handleEraserTool(x, y, phase) {
        const settings = this.toolSettings.eraser;
        const ctx = this.getActiveLayer().ctx;
        
        switch (phase) {
            case 'start':
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.globalAlpha = settings.opacity / 100;
                ctx.lineWidth = settings.size;
                ctx.lineCap = 'round';
                
                ctx.beginPath();
                ctx.arc(x, y, settings.size / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'move':
                ctx.lineWidth = settings.size;
                ctx.beginPath();
                ctx.moveTo(this.lastX, this.lastY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
                
            case 'end':
                ctx.restore();
                this.render();
                this.saveState('Erase');
                break;
        }
    }

    // Bucket Fill
    handleBucketTool(x, y, phase) {
        if (phase === 'start') {
            const settings = this.toolSettings.bucket;
            this.floodFill(x, y, settings.color, settings.tolerance);
            this.render();
            this.saveState('Bucket Fill');
        }
    }

    // Flood fill avançado
    floodFill(startX, startY, fillColor, tolerance = 32) {
        const activeLayer = this.getActiveLayer();
        const imageData = activeLayer.ctx.getImageData(0, 0, activeLayer.canvas.width, activeLayer.canvas.height);
        const data = imageData.data;
        const width = activeLayer.canvas.width;
        const height = activeLayer.canvas.height;
        
        startX = Math.floor(startX);
        startY = Math.floor(startY);
        
        if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;
        
        const startIndex = (startY * width + startX) * 4;
        const startColor = {
            r: data[startIndex],
            g: data[startIndex + 1],
            b: data[startIndex + 2],
            a: data[startIndex + 3]
        };
        
        // Converter cor de preenchimento
        const fill = this.hexToRgb(fillColor);
        
        // Se a cor já é a mesma, não fazer nada
        if (this.colorDistance(startColor, fill) <= tolerance) return;
        
        // Algoritmo flood fill
        const visited = new Set();
        const stack = [{x: startX, y: startY}];
        
        while (stack.length > 0) {
            const {x, y} = stack.pop();
            
            if (x < 0 || x >= width || y < 0 || y >= height) continue;
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            
            const index = (y * width + x) * 4;
            const currentColor = {
                r: data[index],
                g: data[index + 1],
                b: data[index + 2],
                a: data[index + 3]
            };
            
            if (this.colorDistance(startColor, currentColor) <= tolerance) {
                visited.add(key);
                
                // Pintar pixel
                data[index] = fill.r;
                data[index + 1] = fill.g;
                data[index + 2] = fill.b;
                data[index + 3] = 255;
                
                // Adicionar vizinhos
                stack.push(
                    {x: x + 1, y},
                    {x: x - 1, y},
                    {x, y: y + 1},
                    {x, y: y - 1}
                );
            }
        }
        
        activeLayer.ctx.putImageData(imageData, 0, 0);
    }

    // Eyedropper Tool
    handleEyedropperTool(x, y, phase) {
        try {
            if (phase === 'start') {
                const color = this.getPixelColor(x, y);
                if (color) {
                    this.toolSettings.brush.color = color;
                    this.toolSettings.bucket.color = color;
                    this.toolSettings.text.color = color;
                    
                    this.showNotification(`🎨 Cor capturada: ${color}`, 'info');
                    
                    // Disparar evento para atualizar UI
                    const event = new CustomEvent('colorPicked', { detail: { color } });
                    document.dispatchEvent(event);
                    
                    console.log('🎨 Cor capturada:', color);
                } else {
                    console.warn('⚠️ Não foi possível capturar cor na posição:', x, y);
                }
            }
        } catch (error) {
            console.error('❌ Erro no eyedropper:', error);
        }
    }

    // Text Tool
    handleTextTool(x, y, phase) {
        try {
            if (phase === 'start') {
                const text = prompt('Digite o texto:');
                if (!text || text.trim() === '') {
                    console.log('📝 Texto cancelado ou vazio');
                    return;
                }
                
                const settings = this.toolSettings.text;
                const activeLayer = this.getActiveLayer();
                
                if (!activeLayer || !activeLayer.ctx) {
                    console.error('❌ Layer ativa não disponível para texto');
                    return;
                }
                
                const ctx = activeLayer.ctx;
                
                ctx.save();
                ctx.font = `${settings.size || 24}px ${settings.font || 'Arial'}`;
                ctx.fillStyle = settings.color || '#000000';
                ctx.textBaseline = 'top';
                ctx.fillText(text, x, y);
                ctx.restore();
                
                this.render();
                this.saveState('Add Text');
                
                console.log('📝 Texto adicionado:', text, 'em', x, y);
            }
        } catch (error) {
            console.error('❌ Erro ao adicionar texto:', error);
        }
    }

    // ========== SISTEMA DE FILTROS ==========

    applyFilter(filterName, ...params) {
        try {
            console.log('🌈 Aplicando filtro:', filterName, 'params:', params);
            
            const activeLayer = this.getActiveLayer();
            if (!activeLayer || !activeLayer.ctx) {
                console.error('❌ Layer ativa não disponível para filtro');
                this.showNotification('Nenhuma layer ativa para aplicar filtro', 'warning');
                return;
            }
            
            const width = activeLayer.canvas.width;
            const height = activeLayer.canvas.height;
            
            console.log(`🖼️ Obtendo ImageData: ${width}x${height}`);
            const imageData = activeLayer.ctx.getImageData(0, 0, width, height);
            
            if (!imageData || !imageData.data) {
                console.error('❌ ImageData inválida');
                return;
            }
            
            console.log('⚙️ Processando filtro...');
            const filteredData = this.processImageData(imageData, filterName, ...params);
            
            if (filteredData) {
                activeLayer.ctx.putImageData(filteredData, 0, 0);
                this.render();
                this.saveState(`Filter: ${filterName}`);
                
                console.log(`✅ Filtro ${filterName} aplicado com sucesso`);
                this.showNotification(`Filtro ${filterName} aplicado!`, 'success');
            } else {
                console.error(`❌ Filtro ${filterName} falhou`);
                this.showNotification(`Erro ao aplicar filtro ${filterName}`, 'error');
            }
        } catch (error) {
            console.error('❌ Erro ao aplicar filtro:', error);
            this.showNotification('Erro ao processar filtro: ' + error.message, 'error');
        }
    }

    processImageData(imageData, filterName, ...params) {
        try {
            console.log('⚙️ Processando ImageData:', filterName, 'dimensões:', imageData.width, 'x', imageData.height);
            
            const data = new Uint8ClampedArray(imageData.data);
            const width = imageData.width;
            const height = imageData.height;
            
            console.log('📊 Dados originais - pixels:', data.length / 4, 'bytes:', data.length);
            
            let result = null;
            
            switch (filterName) {
                case 'grayscale':
                    console.log('🔲 Aplicando grayscale...');
                    result = this.filterGrayscale(data, width, height);
                    break;
                case 'sepia':
                    console.log('📜 Aplicando sepia...');
                    result = this.filterSepia(data, width, height);
                    break;
                case 'invert':
                    console.log('🔄 Aplicando invert...');
                    result = this.filterInvert(data, width, height);
                    break;
                case 'brightness':
                    const brightness = params[0] || 0;
                    console.log(`💡 Aplicando brightness: ${brightness}`);
                    result = this.filterBrightness(data, width, height, brightness);
                    break;
                case 'contrast':
                    const contrast = params[0] || 0;
                    console.log(`🌇 Aplicando contrast: ${contrast}`);
                    result = this.filterContrast(data, width, height, contrast);
                    break;
                case 'blur':
                    const radius = params[0] || 1;
                    console.log(`🌫️ Aplicando blur radius: ${radius}`);
                    result = this.filterBlur(data, width, height, radius);
                    break;
                default:
                    console.warn('⚠️ Filtro não implementado:', filterName);
                    return null;
            }
            
            if (result) {
                console.log(`✅ Filtro ${filterName} processado com sucesso`);
            } else {
                console.error(`❌ Filtro ${filterName} retornou null`);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Erro ao processar ImageData:', error);
            throw error;
        }
    }

    filterGrayscale(data, width, height) {
        console.log('🔲 Processando grayscale para', data.length / 4, 'pixels');
        
        for (let i = 0; i < data.length; i += 4) {
            const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            data[i] = gray;     // R
            data[i + 1] = gray; // G
            data[i + 2] = gray; // B
            // Alpha (i + 3) permanece inalterado
        }
        
        console.log('✅ Grayscale processado');
        return new ImageData(data, width, height);
    }

    filterSepia(data, width, height) {
        console.log('📜 Processando sepia para', data.length / 4, 'pixels');
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            data[i] = Math.min(255, Math.round((r * 0.393) + (g * 0.769) + (b * 0.189)));
            data[i + 1] = Math.min(255, Math.round((r * 0.349) + (g * 0.686) + (b * 0.168)));
            data[i + 2] = Math.min(255, Math.round((r * 0.272) + (g * 0.534) + (b * 0.131)));
        }
        
        console.log('✅ Sepia processado');
        return new ImageData(data, width, height);
    }

    filterInvert(data, width, height) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }
        return new ImageData(data, width, height);
    }

    filterBrightness(data, width, height, brightness) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, data[i] + brightness));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brightness));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brightness));
        }
        return new ImageData(data, width, height);
    }

    filterContrast(data, width, height, contrast) {
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
        
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
        }
        return new ImageData(data, width, height);
    }

    filterBlur(data, width, height, radius) {
        const result = new Uint8ClampedArray(data);
        
        // Implementação simplificada de blur gaussiano
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let r = 0, g = 0, b = 0, a = 0;
                let count = 0;
                
                // Amostragem ao redor do pixel
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        
                        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                            const index = (ny * width + nx) * 4;
                            r += data[index];
                            g += data[index + 1];
                            b += data[index + 2];
                            a += data[index + 3];
                            count++;
                        }
                    }
                }
                
                const index = (y * width + x) * 4;
                result[index] = r / count;
                result[index + 1] = g / count;
                result[index + 2] = b / count;
                result[index + 3] = a / count;
            }
        }
        
        return new ImageData(result, width, height);
    }

    // ========== SISTEMA DE HISTÓRICO ==========

    saveState(description = 'Action') {
        try {
            console.log(`📚 Salvando estado: ${description}`);
            
            this.historyStep++;
            
            // Remover histórico futuro se necessário
            if (this.historyStep < this.history.length) {
                this.history.length = this.historyStep;
            }
            
            // Criar snapshot do estado atual
            const state = {
                description: description,
                timestamp: Date.now(),
                layers: this.layers.map(layer => {
                    if (!layer || !layer.ctx) {
                        console.warn('⚠️ Layer inválida no saveState:', layer);
                        return null;
                    }
                    
                    return {
                        id: layer.id,
                        name: layer.name,
                        imageData: layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height),
                        visible: layer.visible,
                        opacity: layer.opacity,
                        blendMode: layer.blendMode,
                        locked: layer.locked,
                        width: layer.canvas.width,
                        height: layer.canvas.height
                    };
                }).filter(layer => layer !== null),
                activeLayerIndex: this.activeLayerIndex,
                canvasWidth: this.canvas.width,
                canvasHeight: this.canvas.height
            };
            
            this.history.push(state);
            
            // Limitar histórico
            if (this.history.length > this.maxHistorySteps) {
                this.history.shift();
                this.historyStep--;
            }
            
            console.log(`✅ Estado salvo: ${description} (${this.historyStep + 1}/${this.history.length})`);
        } catch (error) {
            console.error('❌ Erro ao salvar estado:', error);
        }
    }

    undo() {
        try {
            if (this.historyStep > 0) {
                this.historyStep--;
                const state = this.history[this.historyStep];
                
                console.log(`↶ Desfazendo para: ${state.description} (${this.historyStep + 1}/${this.history.length})`);
                
                this.restoreState(state);
                this.showNotification(`Desfeito: ${state.description}`, 'info');
                return true;
            } else {
                console.log('⚠️ Não há ações para desfazer');
                this.showNotification('Nada para desfazer', 'warning');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro no undo:', error);
            return false;
        }
    }

    redo() {
        try {
            if (this.historyStep < this.history.length - 1) {
                this.historyStep++;
                const state = this.history[this.historyStep];
                
                console.log(`↷ Refazendo para: ${state.description} (${this.historyStep + 1}/${this.history.length})`);
                
                this.restoreState(state);
                this.showNotification(`Refeito: ${state.description}`, 'info');
                return true;
            } else {
                console.log('⚠️ Não há ações para refazer');
                this.showNotification('Nada para refazer', 'warning');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro no redo:', error);
            return false;
        }
    }

    restoreState(state) {
        try {
            console.log('♾️ Restaurando estado:', state.description);
            
            // Verificar integridade do estado
            if (!state || !state.layers || !Array.isArray(state.layers)) {
                throw new Error('Estado inválido');
            }
            
            // Redimensionar canvas se necessário
            if (state.canvasWidth && state.canvasHeight) {
                if (this.canvas.width !== state.canvasWidth || this.canvas.height !== state.canvasHeight) {
                    console.log(`📄 Redimensionando canvas: ${state.canvasWidth}x${state.canvasHeight}`);
                    this.resizeCanvas(state.canvasWidth, state.canvasHeight);
                }
            }
            
            // Limpar layers atuais
            this.layers = [];
            
            // Restaurar layers
            console.log(`🎨 Restaurando ${state.layers.length} layers...`);
            
            state.layers.forEach((layerState, index) => {
                if (!layerState) {
                    console.warn('⚠️ LayerState', index, 'está null');
                    return;
                }
                
                const layer = this.createLayer(layerState.name, layerState.width, layerState.height);
                layer.id = layerState.id;
                layer.visible = layerState.visible;
                layer.opacity = layerState.opacity;
                layer.blendMode = layerState.blendMode;
                layer.locked = layerState.locked;
                
                if (layerState.imageData) {
                    layer.ctx.putImageData(layerState.imageData, 0, 0);
                }
                
                this.layers.push(layer);
                console.log(`✅ Layer ${index} restaurada: ${layer.name}`);
            });
            
            // Restaurar layer ativa
            this.activeLayerIndex = Math.min(state.activeLayerIndex || 0, this.layers.length - 1);
            
            // Re-renderizar
            this.render();
            
            console.log(`✅ Estado restaurado: ${state.description}`);
        } catch (error) {
            console.error('❌ Erro ao restaurar estado:', error);
            this.showNotification('Erro ao restaurar estado: ' + error.message, 'error');
        }
    }

    // ========== SISTEMA DE RENDERIZAÇÃO ==========

    render() {
        try {
            if (!this.ctx) {
                console.error('❌ Contexto do canvas não disponível para render');
                return;
            }
            
            // Limpar canvas principal
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Renderizar cada layer visível
            this.layers.forEach((layer, index) => {
                if (!layer || !layer.visible) return;
                
                try {
                    this.ctx.save();
                    this.ctx.globalAlpha = layer.opacity || 1.0;
                    this.ctx.globalCompositeOperation = layer.blendMode || 'source-over';
                    
                    if (layer.canvas) {
                        this.ctx.drawImage(layer.canvas, 0, 0);
                    }
                    
                    this.ctx.restore();
                } catch (error) {
                    console.error(`❌ Erro ao renderizar layer ${index}:`, error);
                }
            });
        } catch (error) {
            console.error('❌ Erro no render():', error);
        }
    }

    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.overlayCanvas.width = width;
        this.overlayCanvas.height = height;
        this.backupCanvas.width = width;
        this.backupCanvas.height = height;
        
        // Reconfigurar contextos
        [this.ctx, this.overlayCtx, this.backupCtx].forEach(ctx => {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        });
    }

    // ========== UTILITÁRIOS ==========

    getActiveLayer() {
        return this.layers[this.activeLayerIndex] || null;
    }

    setActiveLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.activeLayerIndex = index;
            return true;
        }
        return false;
    }

    setLayerOpacity(index, opacity) {
        const layer = this.layers[index];
        if (layer) {
            layer.opacity = Math.max(0, Math.min(1, opacity));
            this.render();
        }
    }

    toggleLayerVisibility(index) {
        const layer = this.layers[index];
        if (layer) {
            layer.visible = !layer.visible;
            this.render();
        }
    }

    setLayerBlendMode(index, blendMode) {
        const layer = this.layers[index];
        if (layer) {
            layer.blendMode = blendMode;
            this.render();
        }
    }

    getPixelColor(x, y) {
        try {
            const px = Math.floor(x);
            const py = Math.floor(y);
            
            if (px < 0 || py < 0 || px >= this.canvas.width || py >= this.canvas.height) {
                console.warn('⚠️ Coordenada fora dos limites do canvas:', px, py);
                return '#000000';
            }
            
            const imageData = this.ctx.getImageData(px, py, 1, 1);
            const [r, g, b] = imageData.data;
            const color = this.rgbToHex(r, g, b);
            
            console.log('🎨 Cor obtida em', px, py, ':', color, `(rgb: ${r},${g},${b})`);
            return color;
        } catch (error) {
            console.error('❌ Erro ao obter cor do pixel:', error);
            return '#000000';
        }
    }

    colorDistance(color1, color2) {
        const dr = color1.r - color2.r;
        const dg = color1.g - color2.g;
        const db = color1.b - color2.b;
        return Math.sqrt(dr * dr + dg * dg + db * db);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    clear() {
        const activeLayer = this.getActiveLayer();
        if (activeLayer) {
            activeLayer.ctx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height);
            this.render();
            this.saveState('Clear Layer');
        }
    }

    showNotification(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        try {
            const event = new CustomEvent('editorNotification', {
                detail: { message, type, timestamp: Date.now() }
            });
            document.dispatchEvent(event);
        } catch (error) {
            console.error('Erro ao disparar notificação:', error);
        }
    }

    showDropZone(show) {
        const event = new CustomEvent('editorDropZone', {
            detail: { show }
        });
        document.dispatchEvent(event);
    }

    // ========== EVENT HANDLERS MOBILE ==========

    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.canvas.dispatchEvent(mouseEvent);
    }

    handleKeyDown(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 's':
                    e.preventDefault();
                    this.saveImage();
                    break;
            }
        } else {
            switch (e.key.toLowerCase()) {
                case 'b':
                    this.setTool('brush');
                    break;
                case 'e':
                    this.setTool('eraser');
                    break;
                case 'g':
                    this.setTool('bucket');
                    break;
                case 'i':
                    this.setTool('eyedropper');
                    break;
                case 't':
                    this.setTool('text');
                    break;
            }
        }
    }

    resize(width, height) {
        this.layers.forEach(layer => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = layer.canvas.width;
            tempCanvas.height = layer.canvas.height;
            tempCtx.drawImage(layer.canvas, 0, 0);
            
            layer.canvas.width = width;
            layer.canvas.height = height;
            layer.ctx.drawImage(tempCanvas, 0, 0, width, height);
        });
        
        this.resizeCanvas(width, height);
        this.render();
        this.saveState('Resize Canvas');
    }

    getInfo() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
            layers: this.layers.length,
            activeLayer: this.activeLayerIndex,
            tool: this.currentTool,
            historySteps: this.history.length,
            historyStep: this.historyStep
        };
    }
}

// Exportar classe para uso global
window.MasterImageEditor = MasterImageEditor;