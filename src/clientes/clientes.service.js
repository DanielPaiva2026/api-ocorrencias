"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientesService = void 0;
var common_1 = require("@nestjs/common");
var genai_1 = require("@google/genai");
var pdf = require('pdf-parse');
var ClientesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ClientesService = _classThis = /** @class */ (function () {
        function ClientesService_1(prisma) {
            this.prisma = prisma;
        }
        ClientesService_1.prototype.findAll = function () {
            return this.prisma.dBCliente.findMany({
                include: {
                    postos_de_trabalho: {
                        include: {
                            alocacoes: {
                                include: { colab: true }
                            }
                        }
                    }
                }
            });
        };
        ClientesService_1.prototype.createSimplificado = function (data) {
            return this.prisma.dBCliente.create({
                data: {
                    nome_razao: data.nome_razao,
                    telefone: data.telefone || null,
                    cidade: data.cidade || null,
                    cep: '00000-000', // valores default para não quebrar constraints
                    endereco: 'Endereço não informado',
                    status: 'AVULSO'
                }
            });
        };
        ClientesService_1.prototype.update = function (id, data) {
            return this.prisma.dBCliente.update({
                where: { id: id },
                data: data
            });
        };
        ClientesService_1.prototype.previewContract = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfData, text, ai, responseSchema, prompt, result, data, sanitizeStr, mapFuncao;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, pdf(file.buffer)];
                        case 1:
                            pdfData = _a.sent();
                            text = pdfData.text;
                            ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
                            responseSchema = {
                                type: genai_1.Type.OBJECT,
                                properties: {
                                    razao_social: { type: genai_1.Type.STRING },
                                    cnpj: { type: genai_1.Type.STRING },
                                    endereco: { type: genai_1.Type.STRING },
                                    responsavel: { type: genai_1.Type.STRING },
                                    telefone: { type: genai_1.Type.STRING },
                                    cep: { type: genai_1.Type.STRING },
                                    numero: { type: genai_1.Type.STRING },
                                    complemento: { type: genai_1.Type.STRING },
                                    bairro: { type: genai_1.Type.STRING },
                                    cidade: { type: genai_1.Type.STRING },
                                    uf: { type: genai_1.Type.STRING },
                                    observacao: { type: genai_1.Type.STRING, description: 'Escopo do trabalho resumido' },
                                    empresa_contratada: { type: genai_1.Type.STRING, description: 'FALCAO ou MACHADO' },
                                    postos_de_trabalho: {
                                        type: genai_1.Type.ARRAY,
                                        items: {
                                            type: genai_1.Type.OBJECT,
                                            properties: {
                                                funcao: { type: genai_1.Type.STRING, description: 'L para Limpeza, P para Porteiro, E para Encarregado, S para Supervisor, M para Manutenção, J para Jardinagem' },
                                                turno: { type: genai_1.Type.STRING, description: 'D para Diurno, N para Noturno' },
                                                escala_tipo: { type: genai_1.Type.STRING, description: 'A para 12x36, B para 44hs 6x1, C para 44hs 5x2, ou string Parcial caso seja diferente' },
                                                quantidade: { type: genai_1.Type.INTEGER, description: 'Quantidade de postos idênticos' }
                                            }
                                        }
                                    }
                                }
                            };
                            prompt = "Extraia os dados deste contrato de presta\u00E7\u00E3o de servi\u00E7os.\nTexto do contrato:\n".concat(text, "\n\nRetorne um JSON com os dados do cliente e os postos de trabalho. \nIdentifique a raz\u00E3o social (ou nome principal do contratante) no campo razao_social.\nNo campo empresa_contratada, coloque 'FALCAO' se o contratado for FALCAO PAIVA ou AGENTS. Coloque 'MACHADO' se for MACHADO SOLUCOES.\nPara cada posto de trabalho, identifique a fun\u00E7\u00E3o, turno, escala e quantidade solicitada.\n");
                            return [4 /*yield*/, ai.models.generateContent({
                                    model: 'gemini-2.5-flash',
                                    contents: prompt,
                                    config: {
                                        responseMimeType: 'application/json',
                                        responseSchema: responseSchema,
                                    }
                                })];
                        case 2:
                            result = _a.sent();
                            data = JSON.parse(result.text || '{}');
                            sanitizeStr = function (val) { return val ? String(val).trim() : ""; };
                            data.razao_social = sanitizeStr(data.razao_social);
                            data.cnpj = sanitizeStr(data.cnpj);
                            data.endereco = sanitizeStr(data.endereco);
                            data.responsavel = sanitizeStr(data.responsavel);
                            data.telefone = sanitizeStr(data.telefone);
                            data.cep = sanitizeStr(data.cep);
                            data.numero = sanitizeStr(data.numero);
                            data.complemento = sanitizeStr(data.complemento);
                            data.bairro = sanitizeStr(data.bairro);
                            data.cidade = sanitizeStr(data.cidade);
                            data.uf = sanitizeStr(data.uf);
                            data.observacao = sanitizeStr(data.observacao);
                            mapFuncao = {
                                'L': 'Limpeza', 'P': 'Porteiro', 'E': 'Encarregado', 'S': 'Supervisor', 'M': 'Manutenção', 'J': 'Jardinagem'
                            };
                            if (data.postos_de_trabalho) {
                                data.postos_de_trabalho = data.postos_de_trabalho.map(function (posto) { return (__assign(__assign({}, posto), { funcao_nome: mapFuncao[posto.funcao] || 'Limpeza', funcao_codigo: posto.funcao || 'L' })); });
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        ClientesService_1.prototype.confirmContract = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                var prefix, lastClient, nextNumber, match, newCodigo, postosParaInserir, _i, _a, posto, funcaoChar, turnoChar, isParcial, escalaChar, tipoChar, i, sequencia, codigoPosto, novoCliente;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prefix = data.empresa_contratada === 'MACHADO' ? 'MC' : 'FC';
                            return [4 /*yield*/, this.prisma.dBCliente.findFirst({
                                    where: { codigo: { startsWith: prefix } },
                                    orderBy: { codigo: 'desc' }
                                })];
                        case 1:
                            lastClient = _b.sent();
                            nextNumber = 1;
                            if (lastClient && lastClient.codigo) {
                                match = lastClient.codigo.match(/\d+$/);
                                if (match)
                                    nextNumber = parseInt(match[0], 10) + 1;
                            }
                            newCodigo = "".concat(prefix).concat(String(nextNumber).padStart(3, '0'));
                            postosParaInserir = [];
                            if (data.postos_de_trabalho) {
                                for (_i = 0, _a = data.postos_de_trabalho; _i < _a.length; _i++) {
                                    posto = _a[_i];
                                    funcaoChar = posto.funcao_codigo || 'L';
                                    turnoChar = posto.turno || 'D';
                                    isParcial = !['A', 'B', 'C'].includes(posto.escala_tipo);
                                    escalaChar = isParcial ? 'D' : posto.escala_tipo;
                                    tipoChar = '-';
                                    for (i = 1; i <= (posto.quantidade || 1); i++) {
                                        sequencia = posto.quantidade === 1 ? 'U' : String(i);
                                        codigoPosto = "".concat(newCodigo, " - ").concat(funcaoChar).concat(turnoChar).concat(tipoChar).concat(escalaChar, "/").concat(sequencia);
                                        postosParaInserir.push({
                                            codigo: codigoPosto,
                                            categoria_posto: posto.funcao_nome || 'Limpeza',
                                            turno: posto.turno === 'D' ? 'Diurno' : 'Noturno',
                                            tipo_escala: isParcial ? "D - ".concat(posto.escala_tipo) : posto.escala_tipo,
                                            exige_nr32: false,
                                            exige_nr35: false,
                                        });
                                    }
                                }
                            }
                            return [4 /*yield*/, this.prisma.dBCliente.create({
                                    data: {
                                        codigo: newCodigo,
                                        nome_razao: data.razao_social || 'Desconhecido',
                                        cnpj: data.cnpj || "",
                                        endereco: data.endereco || "",
                                        responsavel: data.responsavel || "",
                                        telefone: data.telefone || "",
                                        cep: data.cep || "",
                                        numero: data.numero || "",
                                        complemento: data.complemento || "",
                                        bairro: data.bairro || "",
                                        cidade: data.cidade || "",
                                        uf: data.uf || "",
                                        observacao: data.observacao || "",
                                        status: 'Ativo',
                                        postos_de_trabalho: {
                                            create: postosParaInserir
                                        }
                                    },
                                    include: {
                                        postos_de_trabalho: true
                                    }
                                })];
                        case 2:
                            novoCliente = _b.sent();
                            return [2 /*return*/, novoCliente];
                    }
                });
            });
        };
        return ClientesService_1;
    }());
    __setFunctionName(_classThis, "ClientesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ClientesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ClientesService = _classThis;
}();
exports.ClientesService = ClientesService;
