module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('usuarios', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [6, 100]
            }
        },
        rol: {
            type: DataTypes.ENUM('admin', 'docente', 'alumno'),
            allowNull: false,
            validate: {
                isIn: [['admin', 'docente', 'alumno']]
            }
        }
    }, {
        timestamps: true,
        hooks: {
            beforeCreate: async (usuario) => {
                if (usuario.password) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            },
            beforeUpdate: async (usuario) => {
                if (usuario.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            }
        }
    });

    // Método para comparar contraseñas
    Usuario.prototype.validarPassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    return Usuario;
};