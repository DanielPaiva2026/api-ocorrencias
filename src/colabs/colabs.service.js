"use strict";
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
exports.ColabsService = void 0;
var common_1 = require("@nestjs/common");
var csvParser = require("csv-parser");
var stream_1 = require("stream");
var fs = require("fs");
var ColabsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ColabsService = _classThis = /** @class */ (function () {
        function ColabsService_1(prisma) {
            this.prisma = prisma;
        }
        ColabsService_1.prototype.importFerias = function () {
            return __awaiter(this, void 0, void 0, function () {
                function normalizeDate(str) {
                    if (!str)
                        return null;
                    var s = str.trim();
                    if (!s)
                        return null;
                    var match = s.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
                    if (match) {
                        var year = parseInt(match[3], 10) + 2000;
                        return "".concat(match[1], "/").concat(match[2], "/").concat(year);
                    }
                    return s;
                }
                var csvPath, content, lines, updatedCount, i, line, cols, nome, matricula, colab, admissao, ultimo_aquisitivo, notificacao, limite_entrada, retorno, vencimento;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            csvPath = 'C:\\Users\\Daniel\\Downloads\\ALOCAÇÃO DE COLABORADORES - FÉRIAS.csv';
                            if (!fs.existsSync(csvPath))
                                return [2 /*return*/, { message: 'File not found' }];
                            content = fs.readFileSync(csvPath, 'utf8');
                            lines = content.split('\n');
                            updatedCount = 0;
                            console.log("Read ".concat(lines.length, " lines from CSV!"));
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < lines.length)) return [3 /*break*/, 5];
                            line = lines[i].trim();
                            if (!line)
                                return [3 /*break*/, 4];
                            cols = line.split(',');
                            nome = cols[0];
                            matricula = cols[5];
                            if (!matricula || matricula.length < 4 || matricula.includes('MATRI')) {
                                // console.log(`Skipped: ${nome} - ${matricula}`);
                                return [3 /*break*/, 4];
                            }
                            return [4 /*yield*/, this.prisma.dBColab.findFirst({
                                    where: { OR: [{ matricula: matricula }, { nome: { equals: nome, mode: 'insensitive' } }] }
                                })];
                        case 2:
                            colab = _a.sent();
                            console.log("Checking [".concat(nome, "] [").concat(matricula, "] -> Found? ").concat(!!colab));
                            if (!colab) return [3 /*break*/, 4];
                            admissao = normalizeDate(cols[7]);
                            ultimo_aquisitivo = normalizeDate(cols[9]);
                            notificacao = normalizeDate(cols[10]);
                            limite_entrada = normalizeDate(cols[11]);
                            retorno = normalizeDate(cols[12]);
                            vencimento = normalizeDate(cols[13]);
                            return [4 /*yield*/, this.prisma.dBColab.update({
                                    where: { id: colab.id },
                                    data: {
                                        admissao: admissao || colab.admissao,
                                        ferias_ultimo_aquisitivo: ultimo_aquisitivo,
                                        ferias_notificacao: notificacao,
                                        ferias_limite_entrada: limite_entrada,
                                        ferias_retorno: retorno,
                                        ferias_vencimento: vencimento
                                    }
                                })];
                        case 3:
                            _a.sent();
                            updatedCount++;
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, { success: true, updatedCount: updatedCount }];
                    }
                });
            });
        };
        ColabsService_1.prototype.findAll = function () {
            return this.prisma.dBColab.findMany({
                include: {
                    alocacoes: {
                        include: {
                            posto: {
                                include: { cliente: true }
                            }
                        }
                    }
                }
            });
        };
        ColabsService_1.prototype.create = function (createColabDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.dBColab.create({
                            data: createColabDto,
                        })];
                });
            });
        };
        ColabsService_1.prototype.uploadCsv = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                var results, csvParserObj;
                var _this = this;
                return __generator(this, function (_a) {
                    results = [];
                    csvParserObj = typeof csvParser === 'function' ? csvParser : csvParser.default || csvParser;
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            stream_1.Readable.from(file.buffer)
                                .pipe(csvParserObj({ separator: ',' }))
                                .on('data', function (data) {
                                if (data.nome && data.papel && data.turno_base) {
                                    results.push({
                                        nome: data.nome,
                                        matricula: data.matricula || null,
                                        papel: data.papel,
                                        turno_base: data.turno_base,
                                        cep: data.cep || '00000-000',
                                        endereco: data.endereco || 'Endereço não informado',
                                        horas_contratadas: data.horas_contratadas || null,
                                        tipo_contratacao: data.tipo_contratacao || null,
                                        status_cadastro: data.status_cadastro || null,
                                        admissao: data.admissao || null,
                                        ctps: data.ctps || null,
                                        experiencia_1: data.experiencia_1 || null,
                                        experiencia_2: data.experiencia_2 || null,
                                        situacao_disponibilidade: data.situacao_disponibilidade || null,
                                        data_retorno: data.data_retorno || null,
                                        justificativa_inativo: data.justificativa_inativo || null,
                                        data_integracao: data.data_integracao || null,
                                        reciclagem_integracao: data.reciclagem_integracao || null,
                                        data_nr32: data.data_nr32 || null,
                                        reciclagem_nr32: data.reciclagem_nr32 || null,
                                        data_nr35: data.data_nr35 || null,
                                        reciclagem_nr35: data.reciclagem_nr35 || null,
                                        data_aso: data.data_aso || null,
                                        reciclagem_aso: data.reciclagem_aso || null,
                                    });
                                }
                            })
                                .on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                                var error_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            if (!(results.length > 0)) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.prisma.dBColab.createMany({
                                                    data: results,
                                                    skipDuplicates: true,
                                                })];
                                        case 1:
                                            _a.sent();
                                            _a.label = 2;
                                        case 2:
                                            resolve({ success: true, count: results.length });
                                            return [3 /*break*/, 4];
                                        case 3:
                                            error_1 = _a.sent();
                                            reject(error_1);
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })
                                .on('error', function (error) { return reject(error); });
                        })];
                });
            });
        };
        ColabsService_1.prototype.updateStatus = function (id, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.dBColab.update({
                            where: { id: id },
                            data: { status_cadastro: status }
                        })];
                });
            });
        };
        return ColabsService_1;
    }());
    __setFunctionName(_classThis, "ColabsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ColabsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ColabsService = _classThis;
}();
exports.ColabsService = ColabsService;
